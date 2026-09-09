import z from "zod";

export const passMarksSchema = z.coerce
  .number()
  .min(1, "Passing marks cannot be less than 1");

export const questionSchema = z
  .string()
  .nonempty("Question is required")
  .transform((html) => {
    const div = document.createElement("div");
    div.innerHTML = html;
    return div.textContent?.trim() ?? "";
  })
  .refine(
    (text) => text.length >= 10,
    "Question cannot be less than 10 characters",
  )
  .refine(
    (text) => text.length <= 10_000,
    "Question cannot be more than 10,000 characters",
  );

export const optionSchema = z
  .string()
  .nonempty("Option is required")
  .min(2, "Option cannot be less than 10 characters")
  .max(10_000, "Option cannot be more than 10,000 characters");

export const instructionSchema = z
  .string()
  .transform((html) => {
    const div = document.createElement("div");
    div.innerHTML = html;
    return div.textContent?.trim() ?? "";
  })
  .optional()
  .refine(
    (text) => text === "" || (text && text.length >= 10),
    "Instructions cannot be less than 10 characters",
  )
  .refine(
    (text) => text === "" || (text && text.length <= 1000),
    "Instructions cannot be more than 255 characters",
  );
