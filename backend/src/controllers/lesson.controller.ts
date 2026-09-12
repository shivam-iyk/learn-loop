import { Request, Response } from "express";
import asyncHandler from "../utils/AsyncHandler";
import ApiError from "../utils/ApiError";
import { query } from "../db";
import ApiResponse from "../utils/ApiResponse";
import {
  createLessonSchema,
  reorderLessonsSchema,
  updateLessonSchema,
} from "../schemas/lesson.schema";
import { getVideoDuration, getYouTubeVideoId } from "../utils/youtube";

const createLesson = asyncHandler(async (req: Request, res: Response) => {
  const id = req.user?.id;
  const role = req.user?.role;
  if (!id || role !== "instructor") {
    throw new ApiError(400, "Unauthorized request", ["UNAUTHORIZED"]);
  }

  const parsed = createLessonSchema.safeParse(req.body);
  if (!parsed.success) {
    const errors = parsed.error.issues.map((issue) => issue.message);
    throw new ApiError(400, "Validation failed", errors);
  }

  const { name, type, course, sequence, notes, video } = parsed.data;

  let duration: number | null = null;
  if (video) {
    const videoDuration = await getVideoDuration(video);
    if (typeof videoDuration === "number") {
      duration = videoDuration;
    } else if (videoDuration === "VIDEO_NOT_FOUND") {
      throw new ApiError(404, "Video not found", [videoDuration]);
    } else if (videoDuration === "INVALID_VIDEO_STATUS") {
      throw new ApiError(400, "Video must be public or unlisted", [
        videoDuration,
      ]);
    }
  }

  const { rows: lesson } = await query(
    "INSERT INTO lessons(name, type, course, sequence, notes, video, duration) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
    [name, type, course, sequence, notes, video, duration],
  );

  if (!lesson[0]) {
    throw new ApiError(
      500,
      "Failed to create lesson, Please try again later!",
      ["ACTION_FAILED"],
    );
  }

  await query("UPDATE courses SET lessons = lessons + 1 WHERE id = $1", [
    course,
  ]);

  return res
    .status(201)
    .json(new ApiResponse(201, lesson[0], "Lesson created successfully"));
});

const getLessons = asyncHandler(async (req: Request, res: Response) => {
  const id = req.user?.id;
  const role = req.user?.role;
  if (!id) throw new ApiError(400, "Unauthorized request", ["UNAUTHORIZED"]);

  const { courseId } = req.params;
  if (!courseId || typeof courseId !== "string" || isNaN(parseInt(courseId))) {
    throw new ApiError(400, "Course ID is required and must be a valid number");
  }

  if (role === "student") {
    const { rows: enrollment } = await query(
      "SELECT id FROM enrollments WHERE course = $1 AND user_id = $2",
      [courseId, id],
    );
    if (!enrollment[0]) {
      throw new ApiError(401, "You are not enrolled to this course");
    }
  } else if (role === "instructor") {
    const { rows: course } = await query(
      "SELECT owner FROM courses WHERE id = $1",
      [courseId],
    );
    if (course[0]?.owner !== id) {
      throw new ApiError(401, "You cannot access these resources");
    }
  }

  const { rows: lessons } = await query(
    "SELECT * FROM lessons WHERE course = $1",
    [courseId],
  );

  return res
    .status(200)
    .json(new ApiResponse(200, lessons, "Lessons fetched successfully"));
});

const reorderLessons = asyncHandler(async (req: Request, res: Response) => {
  const id = req.user?.id;
  const role = req.user?.role;
  if (!id || role !== "instructor") {
    throw new ApiError(400, "Unauthorized request", ["UNAUTHORIZED"]);
  }

  const parsed = reorderLessonsSchema.safeParse(req.body);
  if (!parsed.success) {
    const errors = parsed.error.issues.map((issue) => issue.message);
    throw new ApiError(400, "Validation failed", errors);
  }

  const { lessons } = parsed.data;

  const { rows: validation } = await query(
    `SELECT c.owner, l.course
    FROM lessons l
    JOIN courses c ON l.course = c.id
    WHERE l.id = ANY($1::int[])
  `,
    [lessons.map((lesson) => lesson.id)],
  );

  const courseIds = new Set(validation.map((item) => item?.course));
  const validOwner = validation.every((item) => item?.owner === id);

  if (courseIds.size > 1) {
    throw new ApiError(401, "Some lessons belong to other courses", [
      "LESSONS_BELONG_TO_OTHER_COURSES",
    ]);
  }

  if (!validOwner) {
    throw new ApiError(401, "Some lessons do not belong your courses", [
      "LESSONS_NOT_OWNED_BY_USER",
    ]);
  }

  const values = lessons
    .map((lesson) => `(${lesson.id}, ${lesson.sequence})`)
    .join(", ");

  const { rows: updatedLessons } = await query(
    `UPDATE lessons AS l
    SET sequence = value.sequence
    FROM (VALUES ${values}) AS value(id, sequence)
    WHERE l.id = value.id
    RETURNING l.*
  `,
  );

  if (!updatedLessons[0]) {
    throw new ApiError(
      500,
      "Failed to reorder lessons, Please try again later!",
      ["ACTION_FAILED"],
    );
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedLessons, "Lessons reordered successfully"),
    );
});

const updateLesson = asyncHandler(async (req: Request, res: Response) => {
  const id = req.user?.id;
  const role = req.user?.role;
  if (!id || role === "student") {
    throw new ApiError(400, "Unauthorized request", ["UNAUTHORIZED"]);
  }

  const parsed = updateLessonSchema.safeParse(req.body);
  if (!parsed.success) {
    const errors = parsed.error.issues.map((issue) => issue.message);
    throw new ApiError(400, "Validation failed", errors);
  }

  const { name, type, notes, video } = parsed.data;
  const { lessonId } = req.params;
  if (!lessonId || typeof lessonId !== "string" || isNaN(parseInt(lessonId))) {
    throw new ApiError(400, "Lesson ID is required", ["LESSON_ID_REQUIRED"]);
  }

  let duration: number | null = null;
  if (video) {
    const videoDuration = await getVideoDuration(video);
    if (typeof videoDuration === "number") {
      duration = videoDuration;
    } else if (videoDuration === "VIDEO_NOT_FOUND") {
      throw new ApiError(404, "Video not found", [videoDuration]);
    } else if (videoDuration === "INVALID_VIDEO_STATUS") {
      throw new ApiError(400, "Video must be public or unlisted", [
        videoDuration,
      ]);
    }
  }

  const { rows: lessonExists } = await query(
    `SELECT c.owner AS owner, c.id AS course
     FROM lessons l
     JOIN courses c ON l.course = c.id
     WHERE l.id = $1`,
    [lessonId],
  );

  if (lessonExists[0]?.owner !== id && role === "instructor") {
    throw new ApiError(401, "You are not authorized to update this lesson", [
      "UNAUTHORIZED",
    ]);
  }

  const { rows: lesson } = await query(
    `UPDATE lessons 
     SET name = COALESCE($1::text, name),
     type = COALESCE($2::text, type),
     notes = COALESCE($3::text, notes),
     video = COALESCE($4::text, video),
     duration = COALESCE($5::int, duration)
     WHERE id = $6
     RETURNING *`,
    [name, type, notes, video, duration, lessonId],
  );

  if (!lesson[0]) {
    throw new ApiError(500, "Failed to update lesson", ["ACTION_FAILED"]);
  }

  return res
    .status(200)
    .json(new ApiResponse(200, lesson[0], "Lesson updated successfully"));
});

const deleteLesson = asyncHandler(async (req: Request, res: Response) => {
  const id = req.user?.id;
  const role = req.user?.role;
  if (!id || role === "student") {
    throw new ApiError(400, "Unauthorized request", ["UNAUTHORIZED"]);
  }

  const { lessonId } = req.params;
  if (!lessonId || typeof lessonId !== "string" || isNaN(parseInt(lessonId))) {
    throw new ApiError(400, "Lesson ID is required", ["LESSON_ID_REQUIRED"]);
  }

  const { rows: lesson } = await query(
    `SELECT c.owner AS owner, c.id AS course
    FROM lessons l
    JOIN courses c ON c.id = l.course
    WHERE l.id = $1`,
    [lessonId],
  );
  if (!lesson[0]) {
    throw new ApiError(404, "Lesson not found", ["NOT_FOUND"]);
  }

  if (lesson[0]?.owner !== id && role === "instructor") {
    throw new ApiError(401, "You are not allowed to delete this lesson", [
      "UNAUTHORIZED",
    ]);
  }

  await query("BEGIN");

  const { rows: deletedLesson } = await query(
    "DELETE FROM lessons WHERE id = $1 RETURNING *",
    [lessonId],
  );

  if (!deletedLesson[0]) {
    await query("ROLLBACK");
    throw new ApiError(
      500,
      "Failed to delete lesson, Please try again later!",
      ["ACTION_FAILED"],
    );
  }

  await query("COMMIT");

  return res
    .status(200)
    .json(
      new ApiResponse(200, deletedLesson[0], "Lesson deleted successfully"),
    );
});

export { getLessons, createLesson, reorderLessons, updateLesson, deleteLesson };
