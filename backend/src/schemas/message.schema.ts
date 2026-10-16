import z from "zod";

export const newMessageSchema = z.object({
  message: z.string(),
  course: z.coerce.number().nonnegative(),
});

export const getMessagesSchema = z.object({
  page: z.coerce.number().default(1),
  limit: z.coerce.number().max(50).default(20),
});
