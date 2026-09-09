import { z } from "zod";
import "../utils/zod";

const getSuggestionsSchema = z.object({
  search: z
    .string()
    .min(1, "Query cannot be less than 1 characters")
    .max(255, "Query cannot be more than 255 characters"),
});

const getCoursesSchema = z.object({
  categories: z.string().optional(),
  page: z.coerce.number().default(1),
  limit: z.coerce.number().max(50).default(10),
  search: z.string().optional(),
  rating: z.coerce.number().min(0).max(5).optional(),
  sort: z
    .enum(["latest", "popular", "price-low", "price-high"])
    .default("latest"),
  minPrice: z.coerce.number().int().nonnegative().optional(),
  maxPrice: z.coerce.number().int().nonnegative().optional(),
  minLessons: z.coerce.number().int().nonnegative().optional(),
  maxLessons: z.coerce.number().int().nonnegative().optional(),
});

const skill = z
  .string()
  .min(2, "Skills cannot be less than 2 characters")
  .max(50, "Skills cannot be more than 50 characters");

const createCourseSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters long")
    .max(255, "Name must be at most 255 characters long"),
  tagline: z
    .string()
    .nonempty("Tagline cannot be empty")
    .min(1, "Tagline cannot be more than 2 characters")
    .max(100, "Tagline must be less than 100 characters"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters long")
    .max(10_000, "Description must be at most 10,000 characters long"),
  price: z.coerce.number().int().nonnegative(),
  category: z
    .string()
    .min(2, "Category must be at least 2 characters long")
    .max(255, "Category must be at most 255 characters long"),
  skills: skill.or(z.array(skill, "Invalid skills")).optional(),
  status: z
    .string()
    .refine((data) => ["published", "draft", "archived"].includes(data), {
      message: "Status must be either 'published', 'draft' or 'archived'",
    })
    .optional(),
});

export { getSuggestionsSchema, getCoursesSchema, createCourseSchema };
