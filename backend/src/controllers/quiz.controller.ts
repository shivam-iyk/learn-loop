import { Request, Response } from "express";
import asyncHandler from "../utils/AsyncHandler";
import { lessonIdSchema } from "../schemas/param.schema";
import ApiError from "../utils/ApiError";
import { query } from "../db";
import ApiResponse from "../utils/ApiResponse";

const getQuiz = asyncHandler(async (req: Request, res: Response) => {
  const id = req.user?.id;
  const role = req.user?.role;
  if (!id) {
    throw new ApiError(400, "Unauthorized request", ["UNAUTHORIZED"]);
  }

  const parsed = lessonIdSchema.safeParse(req.params);
  if (!parsed.success) {
    const errors = parsed.error.issues.map((err) => err.message);
    throw new ApiError(400, "Validation Error", errors);
  }
  const { lessonId } = parsed.data;

  if (role === "student") {
    const { rows: enrollment } = await query(
      `SELECT e.id 
      FROM enrollments e
      JOIN courses c ON c.id = e.course
      JOIN lesson l ON l.course = c.id
      WHERE l.id = $1 AND e.user_id = $2`,
      [lessonId, id],
    );
    if (!enrollment[0]) {
      throw new ApiError(401, "You are not enrolled to this course");
    }
  } else if (role === "instructor") {
    const { rows: course } = await query(
      `SELECT c.owner 
      FROM courses c
      JOIN lessons l ON c.id = l.course
      WHERE l.id = $1`,
      [lessonId],
    );
    if (course[0]?.owner !== id) {
      throw new ApiError(401, "You cannot access these resources");
    }
  }

  const { rows: quiz } = await query(
    `SELECT *
    FROM quizzes
    WHERE lesson = $1`,
    [lessonId],
  );

  if (!quiz[0]) {
    throw new ApiError(404, "Quiz not found", ["NOT_FOUND"]);
  }

  const { rows: questions } = await query(
    `SELECT * 
    FROM questions
    WHERE quiz = $1`,
    [quiz[0]?.id],
  );

  const questionIds = questions?.map((item) => item?.id);

  const { rows: options } = await query(
    `SELECT * 
    FROM options
    WHERE question = ANY($1::int[])`,
    [questionIds],
  );

  const data = {
    ...quiz[0],
    questions: questions?.map((q) => {
      return {
        ...q,
        options: options.filter((o) => o?.question === q?.id),
      };
    }),
  };

  return res
    .status(200)
    .json(new ApiResponse(200, data, "Quiz found successfully"));
});

export { getQuiz };
