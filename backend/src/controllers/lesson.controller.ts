import { Request, Response } from "express";
import asyncHandler from "../utils/AsyncHandler";
import ApiError from "../utils/ApiError";
import { query } from "../db";
import ApiResponse from "../utils/ApiResponse";
import {
  createLessonSchema,
  reorderLessonsSchema,
  updateLessonSchema,
} from "../schemas/lesson.schema";
import { getVideoDuration, getYouTubeVideoId } from "../utils/youtube";
import getPlaceholderData from "../utils/placeholder";
import { courseIdSchema, lessonIdSchema } from "../schemas/param.schema";

const createLesson = asyncHandler(async (req: Request, res: Response) => {
  const id = req.user?.id;
  const role = req.user?.role;
  if (!id || role !== "instructor") {
    throw new ApiError(400, "Unauthorized request", ["UNAUTHORIZED"]);
  }

  const parsed = createLessonSchema.safeParse(req.body);
  if (!parsed.success) {
    const errors = parsed.error.issues.map((issue) => issue.message);
    console.dir(parsed?.error);
    throw new ApiError(400, "Validation failed", errors);
  }

  const { name, type, course, sequence, notes, video, quiz } = parsed.data;

  let duration: number | null = null;
  if (video) {
    const videoDuration = await getVideoDuration(video);
    if (typeof videoDuration === "number") {
      duration = videoDuration;
    } else if (videoDuration === "VIDEO_NOT_FOUND") {
      throw new ApiError(404, "Video not found", [videoDuration]);
    } else if (videoDuration === "INVALID_VIDEO_STATUS") {
      throw new ApiError(400, "Video must be public or unlisted", [
        videoDuration,
      ]);
    }
  }

  await query("BEGIN");

  const { rows: lesson } = await query(
    `INSERT INTO lessons(name, type, course, sequence, notes, video, duration) 
    VALUES ($1, $2, $3, $4, $5, $6, $7) 
    RETURNING *`,
    [name, type, course, sequence, notes, video, duration],
  );

  if (!lesson[0]) {
    await query("ROLLBACK");
    throw new ApiError(
      500,
      "Failed to create lesson, Please try again later!",
      ["ACTION_FAILED"],
    );
  }

  const data = lesson[0];

  if (quiz) {
    const { rows: savedQuiz } = await query(
      `INSERT INTO quiz(pass_mark, lesson, instructions) 
      VALUES ($1, $2, $3) 
      RETURNING *`,
      [quiz?.pass_mark, lesson[0]?.id, quiz?.instructions],
    );

    if (!savedQuiz[0]) {
      await query("ROLLBACK");
      throw new ApiError(500, "Failed to save quiz, Please try again later!", [
        "ACTION_FAILED",
      ]);
    }

    const options: ((typeof quiz.questions)[number]["options"][number] & {
      question: number;
    })[] = [];
    const questions = quiz.questions.map((item, index) => {
      const { options: itemOptions, ...rest } = item;
      options.push(
        ...itemOptions.map((item) => ({ ...item, question: index })),
      );
      return { ...rest, quiz: savedQuiz[0]?.id };
    });

    const { placeholders: questionPlaceholders, values: questionValues } =
      getPlaceholderData(questions);

    const { rows: savedQuestions } = await query(
      `INSERT INTO quiz_questions (question, answer, type, quiz) 
    VALUES ${questionPlaceholders}
    RETURNING *`,
      questionValues,
    );

    if (savedQuestions?.length === 0) {
      await query("ROLLBACK");
      throw new ApiError(
        500,
        "Failed to save questions, Please try again later!",
        ["ACTION_FAILED"],
      );
    }

    options.forEach((item) => {
      item.question = savedQuestions[item.question]?.id;
    });

    const { placeholders: optionPlaceholders, values: optionValues } =
      getPlaceholderData(options);

    const { rows: savedOptions } = await query(
      `INSERT INTO quiz_options (option, correct, correct_order, match_option_id, question)
      VALUES ${optionPlaceholders}
      RETURNING *`,
      optionValues,
    );

    if (savedOptions?.length === 0) {
      await query("ROLLBACK");
      throw new ApiError(500, "Failed to save quiz, Please try again later!", [
        "ACTION_FAILED",
      ]);
    }

    data.quiz = savedQuiz[0];
    data.quiz.questions = savedQuestions.map((item) => {
      const options = savedOptions.filter(
        (option) => option.question === item.id,
      );
      return {
        ...item,
        options,
      };
    });
  }

  await query("UPDATE courses SET lessons = lessons + 1 WHERE id = $1", [
    course,
  ]);

  await query("COMMIT");

  return res
    .status(201)
    .json(new ApiResponse(201, data, "Lesson created successfully"));
});

const getLessons = asyncHandler(async (req: Request, res: Response) => {
  const id = req.user?.id;
  const role = req.user?.role;
  if (!id) throw new ApiError(400, "Unauthorized request", ["UNAUTHORIZED"]);

  const parsed = courseIdSchema.safeParse(req.params);
  if (!parsed.success) {
    const errors = parsed.error.issues.map((err) => err.message);
    throw new ApiError(400, "Validation error", errors);
  }

  const { courseId } = parsed.data;

  if (role === "student") {
    const { rows: enrollment } = await query(
      "SELECT id FROM enrollments WHERE course = $1 AND user_id = $2",
      [courseId, id],
    );
    if (!enrollment[0]) {
      throw new ApiError(401, "You are not enrolled to this course");
    }
  } else if (role === "instructor") {
    const { rows: course } = await query(
      "SELECT owner FROM courses WHERE id = $1",
      [courseId],
    );
    if (course[0]?.owner !== id) {
      throw new ApiError(401, "You cannot access these resources");
    }
  }

  const { rows: lessons } = await query(
    "SELECT * FROM lessons WHERE course = $1",
    [courseId],
  );

  return res
    .status(200)
    .json(new ApiResponse(200, lessons, "Lessons fetched successfully"));
});

const reorderLessons = asyncHandler(async (req: Request, res: Response) => {
  const id = req.user?.id;
  const role = req.user?.role;
  if (!id || role !== "instructor") {
    throw new ApiError(400, "Unauthorized request", ["UNAUTHORIZED"]);
  }

  const parsed = reorderLessonsSchema.safeParse(req.body);
  if (!parsed.success) {
    const errors = parsed.error.issues.map((issue) => issue.message);
    throw new ApiError(400, "Validation failed", errors);
  }

  const { lessons } = parsed.data;

  const { rows: validation } = await query(
    `SELECT c.owner, l.course
    FROM lessons l
    JOIN courses c ON l.course = c.id
    WHERE l.id = ANY($1::int[])
  `,
    [lessons.map((lesson) => lesson.id)],
  );

  const courseIds = new Set(validation.map((item) => item?.course));
  const validOwner = validation.every((item) => item?.owner === id);

  if (courseIds.size > 1) {
    throw new ApiError(401, "Some lessons belong to other courses", [
      "LESSONS_BELONG_TO_OTHER_COURSES",
    ]);
  }

  if (!validOwner) {
    throw new ApiError(401, "Some lessons do not belong your courses", [
      "LESSONS_NOT_OWNED_BY_USER",
    ]);
  }

  const values = lessons
    .map((lesson) => `(${lesson.id}, ${lesson.sequence})`)
    .join(", ");

  const { rows: updatedLessons } = await query(
    `UPDATE lessons AS l
    SET sequence = value.sequence
    FROM (VALUES ${values}) AS value(id, sequence)
    WHERE l.id = value.id
    RETURNING l.*
  `,
  );

  if (!updatedLessons[0]) {
    throw new ApiError(
      500,
      "Failed to reorder lessons, Please try again later!",
      ["ACTION_FAILED"],
    );
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedLessons, "Lessons reordered successfully"),
    );
});

const updateLesson = asyncHandler(async (req: Request, res: Response) => {
  const id = req.user?.id;
  const role = req.user?.role;
  if (!id || role === "student") {
    throw new ApiError(400, "Unauthorized request", ["UNAUTHORIZED"]);
  }

  const parsed = updateLessonSchema.safeParse(req.body);
  if (!parsed.success) {
    const errors = parsed.error.issues.map((issue) => issue.message);
    throw new ApiError(400, "Validation failed", errors);
  }

  const { name, type, notes, video } = parsed.data;
  const parsedLessonId = lessonIdSchema.safeParse(req.params);
  if (!parsedLessonId.success) {
    const errors = parsedLessonId.error.issues.map((err) => err.message);
    throw new ApiError(400, "Validation error", errors);
  }

  const { lessonId } = parsedLessonId.data;

  let duration: number | null = null;
  if (video) {
    const videoDuration = await getVideoDuration(video);
    if (typeof videoDuration === "number") {
      duration = videoDuration;
    } else if (videoDuration === "VIDEO_NOT_FOUND") {
      throw new ApiError(404, "Video not found", [videoDuration]);
    } else if (videoDuration === "INVALID_VIDEO_STATUS") {
      throw new ApiError(400, "Video must be public or unlisted", [
        videoDuration,
      ]);
    }
  }

  const { rows: lessonExists } = await query(
    `SELECT c.owner AS owner, c.id AS course
     FROM lessons l
     JOIN courses c ON l.course = c.id
     WHERE l.id = $1`,
    [lessonId],
  );

  if (lessonExists[0]?.owner !== id && role === "instructor") {
    throw new ApiError(401, "You are not authorized to update this lesson", [
      "UNAUTHORIZED",
    ]);
  }

  const { rows: lesson } = await query(
    `UPDATE lessons 
     SET name = COALESCE($1::text, name),
     type = COALESCE($2::text, type),
     notes = COALESCE($3::text, notes),
     video = COALESCE($4::text, video),
     duration = COALESCE($5::int, duration)
     WHERE id = $6
     RETURNING *`,
    [name, type, notes, video, duration, lessonId],
  );

  if (!lesson[0]) {
    throw new ApiError(500, "Failed to update lesson", ["ACTION_FAILED"]);
  }

  return res
    .status(200)
    .json(new ApiResponse(200, lesson[0], "Lesson updated successfully"));
});

const deleteLesson = asyncHandler(async (req: Request, res: Response) => {
  const id = req.user?.id;
  const role = req.user?.role;
  if (!id || role === "student") {
    throw new ApiError(400, "Unauthorized request", ["UNAUTHORIZED"]);
  }

  const parsed = lessonIdSchema.safeParse(req.params);
  if (!parsed.success) {
    const errors = parsed.error.issues.map((err) => err.message);
    throw new ApiError(400, "Validation error", errors);
  }

  const { lessonId } = parsed.data;

  const { rows: lesson } = await query(
    `SELECT c.owner AS owner, c.id AS course, l.type, l.id
    FROM lessons l
    JOIN courses c ON c.id = l.course
    WHERE l.id = $1`,
    [lessonId],
  );

  if (!lesson[0]) {
    throw new ApiError(404, "Lesson not found", ["NOT_FOUND"]);
  }

  if (lesson[0]?.owner !== id && role === "instructor") {
    throw new ApiError(401, "You are not allowed to delete this lesson", [
      "UNAUTHORIZED",
    ]);
  }

  await query("BEGIN");

  if (lesson[0]?.type === "quiz") {
    const { rows: quiz } = await query(
      `SELECT quiz.id AS quiz_id, question.id AS question_id
      FROM quizzes 
      JOIN quiz_questions question ON quiz.id = question.quiz
      WHERE quiz.lesson = $1::int`,
      [lesson[0]?.id],
    );
    console.log(quiz, lesson[0]?.id);

    const questionIds = quiz?.map(
      (item: { question_id: number }) => item?.question_id,
    );

    await query("DELETE FROM options WHERE question = ANY($1::int[])", [
      questionIds,
    ]);

    await query("DELETE FROM questions WHERE id = ANY($1::int[])", [
      questionIds,
    ]);

    await query("DELETE FROM quizzes WHERE id = $1", [quiz[0]?.quiz_id]);
  }

  const { rows: deletedLesson } = await query(
    "DELETE FROM lessons WHERE id = $1 RETURNING *",
    [lessonId],
  );

  if (!deletedLesson[0]) {
    await query("ROLLBACK");
    throw new ApiError(
      500,
      "Failed to delete lesson, Please try again later!",
      ["ACTION_FAILED"],
    );
  }

  await query(
    `UPDATE courses 
    SET lessons = lessons - 1
    WHERE id = $1`,
    [deletedLesson[0]?.course],
  );

  await query("COMMIT");

  return res
    .status(200)
    .json(
      new ApiResponse(200, deletedLesson[0], "Lesson deleted successfully"),
    );
});

export { getLessons, createLesson, reorderLessons, updateLesson, deleteLesson };
