import { Request, Response } from "express";
import asyncHandler from "../utils/AsyncHandler";
import { getMessagesSchema, newMessageSchema } from "../schemas/message.schema";
import ApiError from "../utils/ApiError";
import { uploadToCloudinary } from "../utils/cloudinary";
import { query } from "../db";
import { emitSocketEvent } from "../socket";
import { ChatEventEnum } from "../utils/constants";
import ApiResponse from "../utils/ApiResponse";
import { courseIdSchema, messageIdSchema } from "../schemas/param.schema";

const getChats = asyncHandler(async (req: Request, res: Response) => {
  const id = req.user?.id;
  const role = req.user?.role;
  if (!id) throw new ApiError(401, "Unauthorized request", ["UNAUTHORIZED"]);

  const { rows: chats } = await query(
    `SELECT c.id, c.name, c.cover, c.tagline,
      (
        SELECT m.content
        FROM messages AS m
        WHERE m.course = c.id
        ORDER BY m.created_at DESC
        LIMIT 1
      ) AS last_message,
      (
        SELECT m.created_at
        FROM messages AS m
        WHERE m.course = c.id
        ORDER BY m.created_at DESC
        LIMIT 1
      ) AS last_message_at
      FROM enrollments AS e 
      JOIN courses AS c ON c.id = e.course
      WHERE user_id = $1 OR c.owner = $1`,
    [id],
  );

  return res
    .status(200)
    .json(new ApiResponse(200, chats, "Chats found successfully"));
});

const getMessages = asyncHandler(async (req: Request, res: Response) => {
  const id = req.user?.id;
  if (!id) throw new ApiError(401, "Unauthorized request", ["UNAUTHORIZED"]);

  const parsed = courseIdSchema.safeParse(req.params);
  const options = getMessagesSchema.safeParse(req.query);

  if (!parsed.success) {
    const errors = parsed.error.issues.map((err) => err.message);
    throw new ApiError(400, "Validation Error", errors);
  }

  if (!options.data) {
    const errors = options.error.issues.map((err) => err.message);
    throw new ApiError(400, "Validation Error", errors);
  }

  const { courseId } = parsed.data;
  const { page, limit } = options.data;

  const { rows: messages } = await query(
    `SELECT m.*, u.name, u.avatar, u.role, COUNT(*) OVER() AS total_count 
    FROM messages AS m 
    JOIN users u ON u.id = m.sender
    WHERE course = $1
    ORDER BY created_at DESC
    OFFSET ${(page - 1) * limit} ROWS
    LIMIT ${limit}`,
    [courseId],
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        messages: messages?.map(({ total_count, ...course }) => course),
        pagination: {
          page,
          limit,
          total: parseInt(messages[0]?.total_count) || 0,
          pages: Math.ceil(messages[0]?.total_count / limit),
        },
      },
      "Messages found successfully",
    ),
  );
});

const sendMessage = asyncHandler(async (req: Request, res: Response) => {
  const id = req.user?.id;
  if (!id) throw new ApiError(401, "Unauthorized request", ["UNAUTHORIZED"]);

  const parsed = newMessageSchema.safeParse(req.body);
  if (!parsed.success) {
    const errors = parsed.error.issues.map((err) => err.message);
    throw new ApiError(400, "Validation Error", errors);
  }
  const { message: content, course } = parsed.data;

  const attachmentFile = req?.file;

  let attachment = {
    type: "document",
    name: attachmentFile?.filename || `File-${Date.now()}`,
    url: "",
  };
  if (attachmentFile) {
    if (attachmentFile.size > 50_000_000) {
      // File greater than 50MB
      throw new ApiError(400, "Attachment cannot be larger than 50MB", [
        "IMAGE_SIZE",
      ]);
    }

    const url = await uploadToCloudinary(attachmentFile.path, "attachments");
    if (!url) {
      throw new ApiError(
        500,
        "Failed to save attachment, Please try again later",
        ["UPLOAD_FAILED"],
      );
    }
    attachment.url = url;
    const fileType = attachmentFile.mimetype.split("/")[0];
    const knownType = ["image", "video", "audio"].some(
      (item) => item === fileType,
    );
    if (knownType) {
      attachment.type = fileType;
    }
  } else if (!attachmentFile && !content) {
    throw new ApiError(400, "Message is required", ["MESSAGE_REQUIRED"]);
  }

  const { rows: message } = await query(
    "INSERT INTO messages (course, sender, content, attachment) VALUES ($1, $2, $3, $4) RETURNING *",
    [course, id, content, attachment.url ? attachment : null],
  );

  if (!message) {
    throw new ApiError(500, "Failed to send message", ["ACTION_FAILED"]);
  }

  const { rows: users } = await query(
    "SELECT user_id FROM enrollments WHERE course = $1",
    [course],
  );

  users?.forEach((item) => {
    if (item?.toString() === id) return;
    emitSocketEvent(item, ChatEventEnum.MESSAGE_RECIEVED, message);
  });

  return res
    .status(200)
    .json(new ApiResponse(200, message[0], "Message sent successfully"));
});

const editMessage = asyncHandler(async (req: Request, res: Response) => {
  const id = req.user?.id;
  if (!id) throw new ApiError(401, "Unauthorized request", ["UNAUTHORIZED"]);

  const parsed = newMessageSchema.partial({ course: true }).safeParse(req.body);

  if (!parsed.success) {
    const errors = parsed.error.issues.map((err) => err.message);
    throw new ApiError(400, "Validation Error", errors);
  }

  const parsedMessageId = messageIdSchema.safeParse(req.params);
  if (!parsedMessageId.success) {
    const errors = parsedMessageId.error.issues.map((err) => err.message);
    throw new ApiError(400, "Validation Error", errors);
  }

  const { messageId } = parsedMessageId.data;
  const { message: content } = parsed.data;

  const { rows: message } = await query(
    `SELECT * FROM messages WHERE id = $1`,
    [messageId],
  );
  if (!message) {
    throw new ApiError(404, "Message not found", ["MESSAGE_NOT_FOUND"]);
  }

  if (message[0]?.sender.toString() !== id.toString()) {
    throw new ApiError(401, "You are not authorized to edit this message", [
      "UNAUTHORIZED",
    ]);
  }

  const { rows: updatedMessage } = await query(
    `UPDATE messages
    SET content = $1
    WHERE id = $2
    RETURNING *`,
    [content, messageId],
  );

  if (!updatedMessage) {
    throw new ApiError(500, "Failed to update message", ["ACTION_FAILED"]);
  }

  const { rows: users } = await query(
    "SELECT user_id FROM enrollments WHERE course = $1",
    [updatedMessage[0]?.course],
  );

  users?.forEach((item) => {
    if (item?.toString() === id) return;
    emitSocketEvent(
      updatedMessage[0]?.course,
      ChatEventEnum.EDITED_MESSAGE,
      updatedMessage[0],
    );
  });

  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedMessage[0], "Message edited successfully"),
    );
});

const deleteMessage = asyncHandler(async (req: Request, res: Response) => {
  const id = req.user?.id;
  if (!id) throw new ApiError(401, "Unauthorized request", ["UNAUTHORIZED"]);

  const parsed = messageIdSchema.safeParse(req.params);
  if (!parsed.success) {
    const errors = parsed.error.issues.map((err) => err.message);
    throw new ApiError(400, "Validation Error", errors);
  }
  const { messageId } = parsed.data;

  const { rows: message } = await query(
    "SELECT * FROM messages WHERE id = $1",
    [messageId],
  );

  if (!message[0]) {
    throw new ApiError(404, "Message not found", ["NOT_FOUND"]);
  }

  if (message[0]?.sender !== id) {
    throw new ApiError(400, "You are not authorized to delete this message", [
      "UNAUTHORIZED",
    ]);
  }

  await query("DELETE FROM messages WHERE id = $1", [messageId]);

  const { rows: users } = await query(
    "SELECT user_id FROM enrollments WHERE course = $1",
    [message[0]?.course],
  );

  users?.forEach((item) => {
    if (item?.toString() === id) return;
    emitSocketEvent(
      message[0]?.course,
      ChatEventEnum.DELETED_MESSAGE,
      message[0],
    );
  });

  return res
    .status(200)
    .json(new ApiResponse(200, message[0], "Message deleted successfully"));
});

export { getChats, getMessages, sendMessage, editMessage, deleteMessage };
