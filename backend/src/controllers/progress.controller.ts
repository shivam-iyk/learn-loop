import { Request, Response } from "express";
import { query } from "../db";
import ApiError from "../utils/ApiError";
import ApiResponse from "../utils/ApiResponse";
import asyncHandler from "../utils/AsyncHandler";

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

    const { lessonId, courseId } = req.body;
    const { progressId } = req.params;
    if (!progressId && !(lessonId && courseId)) {
      throw new ApiError(
        400,
        "Progress ID or both Lesson ID and Course ID are required",
        ["PROGRESS_ID_OR_LESSON_AND_COURSE_ID_REQUIRED"],
      );
    }

    if (lessonId || typeof lessonId !== "string" || isNaN(parseInt(lessonId))) {
      throw new ApiError(400, "Lesson ID is required", ["LESSON_ID_REQUIRED"]);
    }

    if (courseId || typeof courseId !== "string" || isNaN(parseInt(courseId))) {
      throw new ApiError(400, "Course ID is required", ["COURSE_ID_REQUIRED"]);
    }

    if (
      progressId ||
      typeof progressId !== "string" ||
      isNaN(parseInt(progressId))
    ) {
      throw new ApiError(400, "Progress ID is required", [
        "PROGRESS_ID_REQUIRED",
      ]);
    }

    const { rows: lessonProgress } = await query(
      `UPDATE lesson_progress 
      SET completed = false, completed_at = NULL
      WHERE ($1::int IS NULL OR id = $1) AND 
      ($2::int IS NULL OR  lesson = $2) AND 
      ($3::int IS NULL OR course =$3) AND 
      user_id = $4`,
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
