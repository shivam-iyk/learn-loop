import { Request, Response } from "express";
import asyncHandler from "../utils/AsyncHandler";
import ApiError from "../utils/ApiError";
import { query } from "../db";
import ApiResponse from "../utils/ApiResponse";
import { instructorIdSchema } from "../schemas/param.schema";

const getOverview = asyncHandler(async (req: Request, res: Response) => {
  const id = req.user?.id;
  const role = req.user?.role;
  if (!id || role !== "instructor") {
    throw new ApiError(401, "Unauthorized request", ["UNAUTHORIZED"]);
  }

  const { rows: overview } = await query(
    `SELECT
      COALESCE(SUM(c.students_enrolled), 0) AS enrolled_students,
      COALESCE(SUM(c.students_enrolled * c.price), 0) AS total_revenue,
      COALESCE(
        SUM(c.rating_sum)::numeric / NULLIF(SUM(c.rating_count), 0),
        0
      ) AS avg_rating,
      COALESCE(SUM(c.students_enrolled), 0) AS courses_sold
    FROM courses c
    WHERE c.owner = $1`,
    [id],
  );

  if (!overview[0]) {
    throw new ApiError(500, "Failed to get overview", ["NOT_FOUND"]);
  }

  return res
    .status(200)
    .json(new ApiResponse(200, overview[0], "Overview found successfully"));
});

const getPopularInstructors = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.user?.id;
    if (!id) throw new ApiError(400, "Unauthorized request", ["UNAUTHORIZED"]);

    const { rows: instructors } = await query(
      `SELECT 
        u.id,
        u.name,
        u.avatar,
        u.bio,
        COUNT(c.id) AS total_courses,
        SUM(c.students_enrolled) AS total_students,
        ROUND(SUM(c.rating_sum)::numeric / NULLIF(SUM(c.rating_count), 0), 1) AS average_rating
      FROM users u
      JOIN courses c ON c.owner = u.id
      WHERE u.role = 'instructor' AND c.status = 'published'
      GROUP BY u.id, u.name, u.avatar, u.bio
      ORDER BY total_students DESC`,
    );

    return res
      .status(200)
      .json(new ApiResponse(200, instructors, "Popular Instructors found"));
  },
);

const getRecentEnrollments = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.user?.id;
    const role = req.user?.role;
    if (!id || role !== "instructor") {
      throw new ApiError(401, "Unauthorized request", ["UNAUTHORIZED"]);
    }

    const { rows: enrollments } = await query(
      `SELECT e.id AS id, e.enrolled_at, u.name AS user_name, u.avatar AS user_avatar, c.id AS course_id, c.name AS course_name
    FROM enrollments e
    JOIN courses c ON c.id = e.course
    JOIN users u ON u.id = e.user_id
    WHERE c.owner = $1`,
      [id],
    );

    return res
      .status(200)
      .json(new ApiResponse(200, enrollments, "Enrollments found"));
  },
);

const getInstructor = asyncHandler(async (req: Request, res: Response) => {
  const parsed = instructorIdSchema.safeParse(req.params);
  if (!parsed.success) {
    const errors = parsed.error.issues.map((err) => err.message);
    throw new ApiError(400, "Validation error", errors);
  }

  const { instructorId } = parsed.data;

  const { rows: instructor } = await query(
    `SELECT u.id, u.name, u.bio, u.avatar, u.skills, COALESCE(COUNT(c.id), 0) AS courses, COALESCE(SUM(c.students_enrolled), 0) AS students
    FROM users u
    JOIN courses c ON c.owner = u.id
    WHERE u.id = $1 AND u.role = 'instructor'
    GROUP BY u.id, u.name, u.bio, u.avatar, u.skills`,
    [instructorId],
  );

  if (!instructor[0]) {
    throw new ApiError(404, "Instructor not found", ["INSTRUCTOR_NOT_FOUND"]);
  }

  return res
    .status(200)
    .json(new ApiResponse(200, instructor[0], "Instructor found successfully"));
});

const getInstructors = asyncHandler(async (req: Request, res: Response) => {
  const { rows: instructors } = await query(
    `SELECT 
    u.name, u.skills, u.bio, u.avatar,
    COUNT(c.id) AS courses
   FROM users AS u
   JOIN courses c ON c.owner = u.id AND c.status = 'published'
   WHERE u.role = 'instructor'
   GROUP BY u.name, u.skills, u.bio, u.avatar`,
  );

  return res
    .status(200)
    .json(new ApiResponse(200, instructors, "Instructors found"));
});

export {
  getOverview,
  getPopularInstructors,
  getRecentEnrollments,
  getInstructors,
  getInstructor,
};
