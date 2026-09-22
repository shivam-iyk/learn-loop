import { Request, Response } from "express";
import { query } from "../db";
import ApiError from "../utils/ApiError";
import ApiResponse from "../utils/ApiResponse";
import asyncHandler from "../utils/AsyncHandler";
import {
  courseIdSchema,
  lessonIdSchema,
  progressIdSchema,
} from "../schemas/param.schema";

const markLessonComplete = asyncHandler(async (req: Request, res: Response) => {
  const id = req.user?.id;
  if (!id) throw new ApiError(400, "Unauthorized request", ["UNAUTHORIZED"]);

  const { lessonId, courseId } = req.body;
  if (!lessonId || typeof lessonId !== "string" || isNaN(parseInt(lessonId))) {
    throw new ApiError(400, "Lesson ID is required", ["LESSON_ID_REQUIRED"]);
  }

  if (!courseId || typeof courseId !== "string" || isNaN(parseInt(lessonId))) {
    throw new ApiError(400, "Course ID is required", ["COURSE_ID_REQUIRED"]);
  }

  const { rows: progressExists } = await query(
    "SELECT * FROM lesson_progress WHERE user_id = $1 AND course = $2 AND lesson = $3",
    [id, courseId, lessonId],
  );

  if (!progressExists[0]?.completed) {
    throw new ApiError(200, "Lesson already marked as complete", [
      "ALREADY_SATISFIED",
    ]);
  } else if (progressExists[0]?.id) {
    const { rows: progress } = await query(
      "UPDATE lesson_progress SET completed = true, completed_at = $1 WHERE id = $2 RETURNING *",
      [new Date(), progressExists[0]?.id],
    );
    if (!progress[0]) {
      throw new ApiError(
        500,
        "Failed to mark lesson as complete, Please try again later!",
        ["ACTION_FAILED"],
      );
    }

    return res
      .status(200)
      .json(new ApiResponse(200, progress[0], "Lesson marked as complete"));
  }

  const { rows: lessonProgress } = await query(
    "INSERT INTO lesson_progress(lesson, user_id, completed, course) VALUES ($1, $2, $3, $4) RETURNING *",
    [lessonId, id, true, courseId],
  );

  if (!lessonProgress[0]) {
    throw new ApiError(
      500,
      "Failed to mark lesson as complete, Please try again later!",
    );
  }

  return res
    .status(200)
    .json(new ApiResponse(200, lessonProgress[0], "Lesson marked as complete"));
});

const markLessonIncomplete = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.user?.id;
    if (!id) throw new ApiError(400, "Unauthorized request", ["UNAUTHORIZED"]);

    const parsed = courseIdSchema
      .extend(lessonIdSchema.shape)
      .safeParse(req.body);

    const parsedProgressId = progressIdSchema.safeParse(req.params);
    if (!parsedProgressId.success) {
      const errors = parsedProgressId.error.issues.map((err) => err.message);
      throw new ApiError(400, "Validation error", errors);
    }
    if (!parsed.success) {
      const errors = parsed.error.issues.map((err) => err.message);
      throw new ApiError(400, "Validation error", errors);
    }

    const { progressId } = parsedProgressId.data;
    const { lessonId, courseId } = parsed.data;

    const { rows: lessonProgress } = await query(
      `UPDATE lesson_progress 
      SET completed = false, completed_at = NULL
      WHERE ($1::int IS NULL OR id = $1) OR 
      ($2::int IS NULL OR  lesson = $2) AND 
      ($3::int IS NULL OR course =$3) AND 
      user_id = $4`,
      [progressId, lessonId, courseId, id],
    );
    if (!lessonProgress[0]) {
      throw new ApiError(404, "Lesson progress not found", ["NOT_FOUND"]);
    }

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          lessonProgress[0],
          "Lesson progress fetched successfully",
        ),
      );
  },
);

export { markLessonComplete, markLessonIncomplete };
