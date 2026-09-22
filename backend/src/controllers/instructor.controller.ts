import { Request, Response } from "express";
import asyncHandler from "../utils/AsyncHandler";
import ApiError from "../utils/ApiError";
import { query } from "../db";
import ApiResponse from "../utils/ApiResponse";
import { getInstructorsSchema } from "../schemas/instructor.schema";
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
    throw new ApiError(500, "Failed to get overview, Please try again later!", [
      "ACTION_FAILED",
    ]);
  }

  return res
    .status(200)
    .json(new ApiResponse(200, overview[0], "Overview found successfully"));
});

const getPopularInstructors = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.user?.id;
    if (!id) throw new ApiError(400, "Unauthorized request", ["UNAUTHORIZED"]);

    const { rows: instructors } = await query(`
      SELECT 
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
      ORDER BY total_students DESC
      LIMIT 10`);

    if (!instructors[0]) {
      throw new ApiError(400, "No instructors found", ["NOT_FOUND"]);
    }

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
    `
    SELECT u.name, u.bio, u.avatar, u.cover, u.skills, COALESCE(COUNT(c.id), 0) AS course_count, COALESCE(SUM(c.students_enrolled), 0)
    FROM users u
    JOIN courses c ON c.owner = u.id
    WHERE u.id = $1 AND u.role = 'instructor'
    GROUP BY u.name, u.bio, u.avatar, u.cover, u.skills
    `,
    [instructorId],
  );

  if (!instructor[0]) {
    throw new ApiError(404, "Instructor not found", ["NOT_FOUND"]);
  }

  return res
    .status(200)
    .json(new ApiResponse(200, instructor[0], "Instructor found successfully"));
});

const getInstructors = asyncHandler(async (req: Request, res: Response) => {
  const parsed = getInstructorsSchema.safeParse(req.query);
  if (!parsed.success) {
    const errors = parsed.error.issues.map((err) => err.message);
    throw new ApiError(400, "Validation Error", errors);
  }

  const { skills, minDuration, maxDuration, minCourses, maxCourses } =
    parsed.data;

  const { rows: instructors } = await query(
    `SELECT 
    u.name, u.skills, u.bio, u.avatar,
    COALESCE(SUM(c.students_enrolled), 0) AS total_students,
    COUNT(c.id) AS course_count
   FROM users AS u
   JOIN courses c ON c.owner = u.id AND c.status = 'published'
   WHERE u.role = 'instructor'
   AND ($1::text IS NULL OR $1 = ANY(u.skills))
   AND ($2::int IS NULL OR c.duration >= $2)
   AND ($3::int IS NULL OR c.duration <= $3)
   GROUP BY u.name, u.skills, u.bio, u.avatar
   HAVING
     ($4::int IS NULL OR COUNT(c.id) >= $4)
     AND ($5::int IS NULL OR COUNT(c.id) <= $5)`,
    [skills, minDuration, maxDuration, minCourses, maxCourses],
  );

  if (!instructors[0]) {
    throw new ApiError(404, "No instructors found", ["NOT_FOUND"]);
  }

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
