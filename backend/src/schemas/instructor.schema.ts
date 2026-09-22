import z from "zod";

const getInstructorsSchema = z
  .object({
    skills: z.array(z.string()).optional(),
    minCourses: z.coerce.number().int().nonnegative().optional(),
    maxCourses: z.coerce.number().int().nonnegative().optional(),
    minDuration: z.coerce.number().int().nonnegative().optional(),
    maxDuration: z.coerce.number().int().nonnegative().optional(),
  })
  // .refine(
  //   (data) =>
  //     data.minCourses === undefined ||
  //     data.maxCourses === undefined ||
  //     data.minCourses <= data.maxCourses,
  //   {
  //     message: "Invalid minCourses and maxCourses",
  //   },
  // )
  // .refine(
  //   (data) =>
  //     data.minDuration === undefined ||
  //     data.maxDuration === undefined ||
  //     data.minDuration <= data.maxDuration,
  //   {
  //     message: "Invalid minDuration and maxDuration",
  //   },
  // );

export { getInstructorsSchema };
