import z from "zod";
import "../utils/zod";

export const createReportSchema = z.object({
  issue: z
    .string()
    .nonempty()
    .min(5, "Issue cannot be less than 5 characters")
    .max(255, "Issue cannot be more than 255 charcters"),
  problem: z
    .string()
    .nonempty("Problem cannot be empty")
    .min(50, "Problem cannot be less than 50 characters")
    .max(10000, "Problem cannot be more than 10,000 characters"),
});

export const addCommentSchema = z.object({
  comment: z
    .string()
    .nonempty()
    .min(10, "Comment cannot be less than 10 characters")
    .max(10_000, "Comment cannot be more than 10,000 characters"),
});

export const updateStatusSchema = z.object({
  status: z
    .string()
    .refine((value) => ["pending", "resolved", "rejected"].includes(value)),
});
