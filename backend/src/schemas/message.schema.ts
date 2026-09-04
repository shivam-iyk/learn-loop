import z from "zod";
import "../utils/zod";

export const newMessageSchema = z.object({
  message: z.string(),
  course: z.number().nonnegative(),
});
