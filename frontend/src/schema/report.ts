import z from "zod";

export const problemSchema = z
  .string()
  .nonempty("Problem cannot be empty")
  .min(50, "Problem cannot be less than 50 characters")
  .max(10000, "Problem cannot be more than 10,000 characters");
