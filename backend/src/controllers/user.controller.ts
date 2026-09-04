import { Request, Response } from "express";
import asyncHandler from "../utils/AsyncHandler";
import ApiError from "../utils/ApiError";
import { query } from "../db";
import ApiResponse from "../utils/ApiResponse";
import { deleteFromCloudinary, uploadToCloudinary } from "../utils/cloudinary";
import bcrypt from "bcrypt";
import {
  onboardUserSchema,
  updatePasswordSchema,
} from "../schemas/user.schema";
import { generateToken } from "../utils/token";

const getUser = asyncHandler(async (req: Request, res: Response) => {
  const id = req.user?.id;
  if (!id) throw new ApiError(401, "Unauthorized request", ["UNAUTHORIZED"]);

  const { rows: user } = await query("SELECT * FROM users WHERE id = $1", [id]);

  if (!user[0]) {
    throw new ApiError(404, "User not found", ["USER_NOT_FOUND"]);
  }

  if (!user[0]?.is_verified) {
    throw new ApiError(
      401,
      "Email is not verified, Please verify your email to login",
      ["EMAIL_NOT_VERIFIED", user[0]?.email],
    );
  }

  const {
    password,
    verify_code,
    verify_code_expiry,
    ...userWithoutSensitiveInfo
  } = user[0];

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        userWithoutSensitiveInfo,
        "User fetched successfully",
      ),
    );
});

const becomeInstructor = asyncHandler(async (req: Request, res: Response) => {
  const id = req.user?.id;
  const role = req.user?.role;

  if (role === "instructor") {
    throw new ApiError(400, "You are already an instructor", [
      "ALREADY_AN_INSTRUCTOR",
    ]);
  }

  if (!id || role !== "student") {
    throw new ApiError(400, "Unauthorized request", ["UNAUTHORIZED"]);
  }

  const { rows: user } = await query(
    `UPDATE users SET role = 'instructor' WHERE id = $1 
    RETURNING id, name, email, role, is_verified, is_banned, login_type`,
    [id],
  );

  if (!user[0]) {
    throw new ApiError(
      500,
      "Failed to become instructor, Please try again later!",
      ["ACTION_FAILED"],
    );
  }

  const data = {
    id: user[0]?.id,
    name: user[0]?.name,
    email: user[0]?.email,
    role: user[0]?.role,
    is_verified: user[0]?.is_verified,
    is_banned: user[0]?.is_banned,
    login_type: user[0]?.login_type,
  };

  const updatedToken = await generateToken(data);

  res.clearCookie("token");
  res.cookie("token", updatedToken);

  return res
    .status(200)
    .json(new ApiResponse(200, user[0], "You are now an instructor"));
});

const onboardUser = asyncHandler(async (req: Request, res: Response) => {
  const id = req.user?.id;
  if (!id) throw new ApiError(400, "Unauthorized request", ["UNAUTHORIZED"]);

  const parsed = onboardUserSchema.safeParse(req.body);
  if (!parsed.success) {
    const errors = parsed.error.issues.map((err) => err.message);
    throw new ApiError(400, "Validation Error", errors);
  }

  const { skills, bio } = parsed.data;

  const { rows: user } = await query(
    `UPDATE users 
    SET skills = COALESCE($1::text[], skills), 
    bio = COALESCE($2::text, bio) 
    WHERE id = $3 
    RETURNING skills, bio, id`,
    [skills ?? null, bio ?? null, id],
  );

  if (!user[0]) {
    throw new ApiError(500, "Failed to onboard user, Please try again later!", [
      "ACTION_FAILED",
    ]);
  }

  return res
    .status(200)
    .json(new ApiResponse(200, user[0], "User onboarded successfully"));
});

const updateAvatar = asyncHandler(async (req: Request, res: Response) => {
  const id = req.user?.id;
  if (!id) throw new ApiError(401, "Unauthorized request", ["UNAUTHORIZED"]);

  const avatar = req?.file;
  if (!avatar?.path) {
    throw new ApiError(400, "Avatar image is required", [
      "AVATAR_FILE_REQUIRED",
    ]);
  }

  const avatarUrl = await uploadToCloudinary(avatar.path, "users");
  if (!avatarUrl) {
    throw new ApiError(
      500,
      "Failed to upload avatar, Please try again later!",
      ["UPLOAD_FAILED"],
    );
  }

  const { rows: user } = await query("SELECT avatar FROM users WHERE id = $1", [
    id,
  ]);

  if (!user[0]) {
    throw new ApiError(404, "User not found", ["USER_NOT_FOUND"]);
  }

  if (typeof user[0]?.avatar === "string") {
    const publicId = "lms" + user[0]?.avatar?.split("lms")[1]?.split(".")[0];
    await deleteFromCloudinary(publicId);
  }

  await query("UPDATE users SET avatar = $1 WHERE id = $2 RETURNING avatar", [
    avatarUrl,
    id,
  ]);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { avatar: avatarUrl },
        "Avatar updated successfully",
      ),
    );
});

const removeAvatar = asyncHandler(async (req: Request, res: Response) => {
  const id = req.user?.id;
  if (!id) throw new ApiError(401, "Unauthorized request", ["UNAUTHORIZED"]);

  const { rows: user } = await query("SELECT avatar FROM users WHERE id = $1", [
    id,
  ]);
  if (!user[0]) {
    throw new ApiError(404, "User not found", ["USER_NOT_FOUND"]);
  }

  const publicId = user[0]?.avatar?.split("lms")[1]?.split(".")[0];
  const result = await deleteFromCloudinary(publicId);
  if (!result) {
    throw new ApiError(
      500,
      "Failed to delete avatar, Please try again later!",
      ["UPLOAD_FAILED"],
    );
  }

  await query("UPDATE users SET avatar = $1 WHERE id = $2", [null, id]);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Avatar removed successfully"));
});

const updatePassword = asyncHandler(async (req: Request, res: Response) => {
  const id = req.user?.id;
  if (!id) {
    throw new ApiError(400, "Unauthorized request", ["UNAUTHORIZED"]);
  }

  const parsed = updatePasswordSchema.safeParse(req.body);
  if (!parsed.data) {
    const errors = parsed.error.issues.map((err) => err.message);
    throw new ApiError(400, "Validation Error", errors);
  }

  const { currentPassword, newPassword } = parsed.data;

  const { rows: user } = await query(
    "SELECT email, password FROM users WHERE id = $1",
    [id],
  );

  if (!user[0]) {
    throw new ApiError(404, "User not found", ["USER_NOT_FOUND"]);
  }

  const isCurrentPasswordCorrect = await bcrypt.compare(
    currentPassword,
    user[0]?.password,
  );

  if (!isCurrentPasswordCorrect) {
    throw new ApiError(400, "Current password is incorrect", [
      "PASSWORD_INCORRECT",
    ]);
  }

  const hashedNewPassword = await bcrypt.hash(newPassword, 10);
  await query("UPDATE users SET password = $1 WHERE id = $2", [
    hashedNewPassword,
    id,
  ]);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password updated successfully"));
});

export {
  getUser,
  becomeInstructor,
  onboardUser,
  updateAvatar,
  removeAvatar,
  updatePassword,
};
