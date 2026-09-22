import z from "zod";

const postReviewSchema = z.object({
  rating: z.coerce
    .number()
    .min(1, "Rating must be greater than 1")
    .max(5, "Rating must be less than 5"),
  review: z
    .string()
    .min(5, "Review must be at least 5 characters")
    .max(1000, "Review must be at most 1000 characters")
    .optional(),
  course: z.coerce.number().nonnegative(),
});

export { postReviewSchema };
