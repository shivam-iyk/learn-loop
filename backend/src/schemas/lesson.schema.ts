import { z } from "zod";
import "../utils/zod";

const createLessonSchema = z.object({
  name: z
    .string()
    .min(1, "Lesson name is required")
    .max(255, "Lesson name must be less than 255 characters"),
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
  course: z.coerce.number().int("Course ID must be an integer"),
  sequence: z.coerce.number().int("Sequence must be an integer"),
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
