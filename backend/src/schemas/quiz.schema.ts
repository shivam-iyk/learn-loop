import z from "zod";

export const quizSchema = z.object({
  pass_mark: z.number().nonnegative(),
  instructions: z
    .string()
    .max(10_000, "Instructions cannot be more than 10,000 characters")
    .nullable()
    .default(null),
  questions: z
    .array(
      z.object({
        question: z
          .string()
          .nonempty("Question cannot be empty")
          .min(10, "Question cannot be less than 10 characters")
          .max(10_000, "Question cannot be more than 10,000 characters"),
        answer: z
          .string()
          .max(255, "Answer cannot be more than 255 characters")
          .nullable()
          .default(null),
        type: z
          .string()
          .refine((value) =>
            [
              "single_choice",
              "multiple_choice",
              "true_false",
              "match",
              "fill",
              "order",
              "numerical",
            ].includes(value),
          ),
        options: z
          .array(
            z.object({
              option: z
                .string()
                .nonempty("Option cannot be empty")
                .max(255, "Option cannot be more than 255 characters"),
              correct: z.boolean().default(false),
              correct_order: z.number().nullable().default(null),
              match_option_id: z
                .number()
                .nonnegative()
                .nullable()
                .default(null),
            }),
          )
          .default([]),
      }),
    )
    .min(1, "At least one question is required"),
});
