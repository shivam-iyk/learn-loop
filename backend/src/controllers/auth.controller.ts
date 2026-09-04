import { Request, Response } from "express";
import asyncHandler from "../utils/AsyncHandler";
import { query } from "../db";
import ApiResponse from "../utils/ApiResponse";
import bcrypt from "bcrypt";
import ApiError from "../utils/ApiError";
import sendMail from "../utils/mailer";
import { generateToken } from "../utils/token";
import {
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  verifyMailSchema,
} from "../schemas/auth.schema";

const register = asyncHandler(async (req: Request, res: Response) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    const errors = parsed.error.issues.map((err) => err.message);
    throw new ApiError(400, "Validation Error", errors);
  }
  const { name, email, password } = parsed.data;

  const { rows: userExists } = await query(
    "SELECT * FROM users WHERE email = $1",
    [email],
  );
  if (userExists[0]?.email === email && userExists[0]?.is_verified) {
    throw new ApiError(
      400,
      "Email already registered, Please use another email",
      ["EMAIL_ALREADY_REGISTERED"],
    );
  } else if (userExists[0]?.is_verified === false) {
    await query("DELETE FROM users WHERE email = $1", [email]);
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const verifyCode = Math.floor(Math.random() * 1000000);
  const verifyCodeExpiry = new Date();
  verifyCodeExpiry.setMinutes(verifyCodeExpiry.getMinutes() + 15);

  const data = await sendMail(name, verifyCode, email);
  if (!data) {
    throw new ApiError(500, "Failed to send mail, Please try again later!", [
      "MAIL_SEND_FAILED",
    ]);
  }

  const { rows: user } = await query(
    "INSERT INTO users(name, email, password, verify_code, verify_code_expiry) VALUES ($1, $2, $3, $4, $5) RETURNING email",
    [name, email, hashedPassword, verifyCode, verifyCodeExpiry],
  );

  return res
    .status(200)
    .json(new ApiResponse(200, user[0], "User registered successfully"));
});

const login = asyncHandler(async (req: Request, res: Response) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    const errors = parsed.error.issues.map((err) => err.message);
    throw new ApiError(400, "Validation Error", errors);
  }
  const { email, password } = parsed.data;

  const { rows: user } = await query("SELECT * FROM users WHERE email = $1", [
    email,
  ]);

  if (!user[0]) {
    throw new ApiError(404, "Account does not exists with this email", [
      "ACCOUNT_NOT_FOUND",
    ]);
  }

  if (!user[0]?.is_verified) {
    throw new ApiError(
      400,
      "Email is not verified, Please verify your email to login",
      ["EMAIL_NOT_VERIFIED"],
    );
  }

  const isPasswordCorrect = await bcrypt.compare(password, user[0]?.password);
  if (!isPasswordCorrect) {
    throw new ApiError(400, "Password is incorrect", ["INCORRECT_PASSWORD"]);
  }

  const userData = {
    id: user[0]?.id,
    name: user[0]?.name,
    email: user[0]?.email,
    role: user[0]?.role,
    is_verified: user[0]?.is_verified,
    is_banned: user[0]?.is_banned,
    login_type: user[0]?.login_type,
  };

  const token = await generateToken(userData);
  res.cookie("token", token);

  const {
    password: _,
    verify_code,
    verify_code_expiry,
    ...userWithoutSensitiveInfo
  } = user[0];

  return res
    .status(200)
    .json(new ApiResponse(200, userWithoutSensitiveInfo, "Login successful"));
});

const handleSocialLogin = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new ApiError(401, "User not verified");
  }
  const { id } = req.user;

  const { rows: user } = await query("SELECT * FROM users WHERE id = $1", [id]);
  if (!user[0]) {
    throw new ApiError(404, "User not found", ["USER_NOT_FOUND"]);
  }

  const token = await generateToken(user[0].id.toString());

  return res
    .status(200)
    .cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: parseInt(process.env.COOKIE_EXPIRY || "31536000"),
      sameSite: "lax",
    })
    .redirect(`${process.env.CLIENT_SSO_REDIRECT_URL || "/"}?token=${token}`);
});

const verifyMail = asyncHandler(async (req: Request, res: Response) => {
  const parsed = verifyMailSchema.safeParse(req.body);
  if (!parsed.success) {
    const errors = parsed.error.issues.map((err) => err.message);
    throw new ApiError(400, "Validation Error", errors);
  }
  const { email, code } = parsed.data;

  const { rows: user } = await query("SELECT * FROM users WHERE email = $1", [
    email,
  ]);

  if (!user[0]) {
    throw new ApiError(404, "User not found", ["USER_NOT_FOUND"]);
  }

  if (user[0]?.verify_code.toString() !== code.toString()) {
    throw new ApiError(400, "Invalid verification code", ["INVALID_CODE"]);
  }

  if (user[0]?.verify_code_expiry < new Date()) {
    throw new ApiError(400, "Verification code expired", ["CODE_EXPIRED"]);
  }

  const { rows: updatedUser } = await query(
    "UPDATE users SET is_verified = true, verify_code = 0, verify_code_expiry = $1 WHERE email = $2 RETURNING id",
    [null, email],
  );

  if (!updatedUser) {
    throw new ApiError(500, "Failed to verify email, Please try again later!", [
      "ACTION_FAILED",
    ]);
  }

  const userWithoutSensitiveData = {
    ...user[0],
    is_verified: true,
    verify_code: undefined,
    verify_code_expiry: undefined,
    password: undefined,
  };

  const userData = {
    id: updatedUser[0]?.id,
    name: updatedUser[0]?.name,
    email: updatedUser[0]?.email,
    role: updatedUser[0]?.role,
    is_verified: updatedUser[0]?.is_verified,
    is_banned: updatedUser[0]?.is_banned,
    login_type: updatedUser[0]?.login_type,
  };

  const token = await generateToken(userData);
  res.cookie("token", token);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        userWithoutSensitiveData,
        "Email verified successfully",
      ),
    );
});

const resendVerificationCode = asyncHandler(
  async (req: Request, res: Response) => {
    const parsed = verifyMailSchema.partial({ code: true }).safeParse(req.body);
    if (!parsed.success) {
      const errors = parsed.error.issues.map((err) => err.message);
      throw new ApiError(400, "Validation Error", errors);
    }
    const { email } = parsed.data;

    const { rows: user } = await query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (!user[0]) {
      throw new ApiError(404, "User not found", ["USER_NOT_FOUND"]);
    }

    const verifyCode = Math.floor(Math.random() * 1_000_000);
    const verifyCodeExpiry = new Date();
    verifyCodeExpiry.setMinutes(verifyCodeExpiry.getMinutes() + 15);

    const data = await sendMail(user[0]?.name, verifyCode, email);
    if (!data) {
      throw new ApiError(500, "Failed to send mail, Please try again later!", [
        "MAIL_SEND_FAILED",
      ]);
    }

    await query(
      "UPDATE users SET verify_code = $1, verify_code_expiry = $2 WHERE email = $3",
      [verifyCode, verifyCodeExpiry, email],
    );

    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Verification code resent successfully"));
  },
);

const forgotPassword = asyncHandler(async (req: Request, res: Response) => {
  const parsed = forgotPasswordSchema.safeParse(req.body);
  if (!parsed.success) {
    const errors = parsed.error.issues.map((err) => err.message);
    throw new ApiError(400, "Validation Error", errors);
  }
  const { email, code, newPassword } = parsed.data;

  if (!email || !newPassword) {
    throw new ApiError(400, "Email & New Password are required", [
      "EMAIL_AND_NEW_PASSWORD_REQUIRED",
    ]);
  }

  const { rows: user } = await query("SELECT * FROM users WHERE email = $1", [
    email,
  ]);

  if (!user[0]) {
    throw new ApiError(404, "User not found", ["USER_NOT_FOUND"]);
  }

  if (user[0]?.verify_code.toString() !== code.toString()) {
    throw new ApiError(400, "Invalid verification code", ["INVALID_CODE"]);
  }

  if (user[0]?.verify_code_expiry < new Date()) {
    throw new ApiError(400, "Verification code expired", ["CODE_EXPIRED"]);
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await query("UPDATE users SET password = $1 WHERE email = $2", [
    hashedPassword,
    email,
  ]);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password reset successfully"));
});

const logout = asyncHandler(async (req: Request, res: Response) => {
  res.clearCookie("token");
  return res.status(200).json(new ApiResponse(200, {}, "Logout successful"));
});

export {
  register,
  login,
  verifyMail,
  resendVerificationCode,
  handleSocialLogin,
  forgotPassword,
  logout,
};
