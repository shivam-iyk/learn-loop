import z from "zod";
import { registerSchema } from "./auth.schema";

const onboardUserSchema = z
  .object({
    skills: z.array(
      z
        .string()
        .min(2, "Skill must be at least 2 characters long")
        .max(100, "Skill must be at most 100 characters")
        .optional(),
      "Invalid skills",
    ),
    bio: z
      .string()
      .min(10, "Bio must be at least 10 characters long")
      .max(1000, "Bio must be at most 1000 characters")
      .optional(),
  })
  .refine((data) => Object.values(data).some((v) => v !== undefined), {
    message: "At least one field is required",
  });

const updatePasswordSchema = z.object({
  currentPassword: registerSchema.shape.password,
  newPassword: registerSchema.shape.password,
});

export { onboardUserSchema, updatePasswordSchema };
