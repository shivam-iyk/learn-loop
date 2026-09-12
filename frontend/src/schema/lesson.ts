import z from "zod";

export const nameSchema = z
  .string()
  .nonempty("Lesson name is required")
  .min(2, "Lesson name cannot be less than 2 characters")
  .max(255, "Lesson name cannot be more than 255 characters");

export const typeSchema = z
  .string()
  .refine((item) => ["video", "notes", "quiz"].includes(item), {
    message: "Invalid lesson type",
  });

export const videoSchema = z
  .url({
    hostname: /youtu.be|youtube.com/,
    message: "Invalid Youtube URL provided",
  })
  .optional();

export const durationSchema = z.coerce
  .number()
  .min(1, "Duration cannot be less than 1");

export const notesSchema = z
  .string()
  .transform((html) => {
    const div = document.createElement("div");
    div.innerHTML = html;
    return div.textContent?.trim() ?? "";
  })
  .refine(
    (text) => text && text.length >= 10,
    "Notes cannot be less than 10 characters",
  )
  .refine(
    (text) => text && text.length <= 10_000,
    "Notes cannot be more than 10,000 characters",
  );
