import z from "zod";
import "../utils/zod";

const registerSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters long")
    .max(255, "Name must be at most 255 characters long"),
  email: z
    .email()
    .min(4, "Email must be at least 4 characters")
    .max(255, "Email must be at most 255 characters long"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .max(255, "Password must be at most 255 characters long"),
});

const loginSchema = z.object({
  email: registerSchema.shape.email,
  password: registerSchema.shape.password,
});

const verifyMailSchema = z.object({
  email: registerSchema.shape.email,
  code: z.coerce
    .number()
    .min(100000, "Verification code must be 6 digits")
    .max(999999, "Verification code must be 6 digits"),
});

const resendMailSchema = z.object({
  email: registerSchema.shape.email,
});

const forgotPasswordSchema = z.object({
  email: registerSchema.shape.email,
  code: verifyMailSchema.shape.code,
  newPassword: registerSchema.shape.password,
});

export { registerSchema, loginSchema, verifyMailSchema, resendMailSchema, forgotPasswordSchema };
