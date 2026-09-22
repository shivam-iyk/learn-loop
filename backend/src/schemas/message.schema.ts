import z from "zod";

export const newMessageSchema = z.object({
  message: z.string(),
  course: z.number().nonnegative(),
});
