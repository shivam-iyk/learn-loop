import z from "zod";

export const idSchema = z.coerce.number().int().positive();

export const courseIdSchema = z.object({
  courseId: idSchema,
});

export const lessonIdSchema = z.object({
  lessonId: idSchema,
});

export const quizIdSchema = z.object({
  quizId: idSchema,
});

export const instructorIdSchema = z.object({
  instructorId: idSchema,
});

export const progressIdSchema = z.object({
  progressId: idSchema,
});

export const messageIdSchema = z.object({
  messageId: idSchema,
});

export const reportIdSchema = z.object({
  reportId: idSchema,
});

export const reviewIdSchema = z.object({
  reviewId: idSchema,
});

export const transactionIdSchema = z.object({
  transactionId: idSchema,
});
