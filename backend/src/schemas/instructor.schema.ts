import z from "zod";

const getInstructorsSchema = z.object({
  skills: z.array(z.string()).optional(),
  minCourses: z.coerce.number().int().nonnegative().optional(),
  maxCourses: z.coerce.number().int().nonnegative().optional(),
  minDuration: z.coerce.number().int().nonnegative().optional(),
  maxDuration: z.coerce.number().int().nonnegative().optional(),
});

export { getInstructorsSchema };
