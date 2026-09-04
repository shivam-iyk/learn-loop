import { z } from "zod";
import "../utils/zod";

const getCoursesSchema = z.object({
  category: z.string().optional(),
  page: z.coerce.number().default(1),
  limit: z.coerce.number().max(50).default(10),
  search: z.string().optional(),
  sort: z
    .enum(["latest", "popular", "price-low", "price-high"])
    .default("latest"),
  minPrice: z.coerce.number().int().nonnegative().optional(),
  maxPrice: z.coerce.number().int().nonnegative().optional(),
  minRatings: z.coerce.number().min(0).max(5).optional(),
  maxRatings: z.coerce.number().min(0).max(5).optional(),
  minDuration: z.coerce.number().int().nonnegative().optional(),
  maxDuration: z.coerce.number().int().nonnegative().optional(),
  minLessons: z.coerce.number().int().nonnegative().optional(),
  maxLessons: z.coerce.number().int().nonnegative().optional(),
});

const createCourseSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters long")
    .max(255, "Name must be at most 255 characters long"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters long")
    .max(255, "Description must be at most 255 characters long"),
  price: z.coerce.number().int().nonnegative(),
  level: z
    .string()
    .refine((data) => ["beginner", "intermediate", "advanced"].includes(data), {
      message: "Level must be either 'beginner', 'intermediate' or 'advanced'",
    }),
  category: z
    .string()
    .min(2, "Category must be at least 2 characters long")
    .max(255, "Category must be at most 255 characters long"),
  skills: z.array(z.string().min(2).max(50), "Invalid skills").optional(),
  status: z
    .string()
    .refine((data) => ["published", "draft", "archived"].includes(data), {
      message: "Status must be either 'published', 'draft' or 'archived'",
    })
    .optional(),
});

export { getCoursesSchema, createCourseSchema };
