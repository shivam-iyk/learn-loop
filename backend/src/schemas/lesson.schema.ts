import { z } from "zod";
import { quizSchema } from "./quiz.schema";

const createLessonSchema = z.object({
  name: z
    .string()
    .nonempty("Lesson name is required")
    .min(1, "Lesson name cannot be less than 1 character")
    .max(255, "Lesson name cannot be more than 255 characters"),
  type: z
    .string()
    .refine(
      (val) => ["quiz", "video", "notes"].includes(val),
      "Invalid lesson type",
    ),
  video: z
    .url("Invalid video url")
    .max(255, "Video url cannot be more than 255 charaters")
    .nullish(),
  notes: z.string().optional(),
  course: z.coerce.number().int("Course ID cannot be an integer"),
  sequence: z.coerce.number().int("Sequence cannot be an integer"),
  quiz: quizSchema.nullable(),
});

const updateLessonSchema = z
  .object({
    name: z
      .string()
      .max(255, "Lesson name must be less than 255 characters")
      .optional(),
    type: z
      .string()
      .refine(
        (val) => ["quiz", "video", "notes"].includes(val),
        "Invalid lesson type",
      )
      .optional(),
    video: z
      .url("Invalid video url")
      .max(255, "Video url cannot be more than 255 charaters")
      .nullish(),
    notes: z.string().optional(),
    sequence: z.number().int("Sequence must be an integer").optional(),
    quiz: quizSchema.nullable(),
  })
  .refine((data) => Object.values(data).some((v) => v !== undefined), {
    message: "At least one field must be provided",
  });

const reorderLessonsSchema = z.object({
  lessons: z
    .array(
      z.object({
        id: z.coerce.number().int("Lesson ID must be an integer"),
        sequence: z.coerce.number().int("Sequence must be an integer"),
      }),
      "Invalid lessons",
    )
    .min(2, "At least two lessons are required to reorder")
    .refine(
      (data) => new Set(data.map((item) => item.id)).size === data.length,
      {
        message: "Duplicate ids are not allowed",
      },
    ),
});

export { createLessonSchema, updateLessonSchema, reorderLessonsSchema };
