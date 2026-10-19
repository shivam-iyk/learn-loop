import { Request, Response } from "express";
import ApiError from "../utils/ApiError";
import asyncHandler from "../utils/AsyncHandler";
import { query } from "../db";
import ApiResponse from "../utils/ApiResponse";
import {
  createCourseSchema,
  getCoursesSchema,
  getHomeCoursesSchema,
  getSearchSuggestionsSchema,
} from "../schemas/course.schema";
import { deleteFromCloudinary, uploadToCloudinary } from "../utils/cloudinary";
import { courseIdSchema, instructorIdSchema } from "../schemas/param.schema";

const getSearchSuggestions = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.user?.id || null;

    const parsed = getSearchSuggestionsSchema.safeParse(req.query);
    if (!parsed.success) {
      const errors = parsed.error.issues.map((err) => err.message);
      throw new ApiError(400, "Validation error", errors);
    }

    const { search } = parsed.data;

    const { rows: courses } = await query(
      `SELECT DISTINCT term
      FROM (
          SELECT category AS term
          FROM courses

          UNION ALL

          SELECT unnest(skills) AS term
          FROM courses

          UNION ALL

          SELECT name AS term
          FROM courses
      ) AS suggestions
      WHERE term ILIKE $1 || '%' AND status = 'published' AND NOT is_banned AND NOT ($2::int IS NULL OR owner = $2)
      ORDER BY term
      LIMIT 10`,
      [search, id],
    );

    return res
      .status(200)
      .json(new ApiResponse(200, courses, "Suggestions found"));
  },
);

const getInstructorCourses = asyncHandler(
  async (req: Request, res: Response) => {
    const parsed = instructorIdSchema.safeParse(req.params);
    if (!parsed.success) {
      const errors = parsed.error.issues.map((err) => err.message);
      throw new ApiError(400, "Validation error", errors);
    }

    const { instructorId } = parsed.data;

    const { rows: courses } = await query(
      `SELECT * 
      FROM courses 
      WHERE ($1::int IS NULL OR owner = $1) AND status = 'published' AND NOT is_banned`,
      [instructorId],
    );

    return res
      .status(200)
      .json(new ApiResponse(200, courses, "Courses found successfully"));
  },
);

const getCarouselCards = asyncHandler(async (req: Request, res: Response) => {
  const id = req.user?.id || null;

  let courses;
  let category: "continue" | "suggested" = "suggested";

  const card_columns =
    "c.name, c.cover, c.tagline, c.category, c.skills, c.rating_count, c.rating_sum, c.students_enrolled";

  if (id) {
    category = "continue";
    const { rows } = await query(
      `WITH my_enrollments AS (
        SELECT course, MIN(enrolled_at) AS enrolled_at
        FROM enrollments
        WHERE user_id = $1
        GROUP BY course
      )
      SELECT ${card_columns},
            c.id,
            tl.total_lessons,
            pr.completed_lessons,
            COALESCE(
              ROUND(100.0 * pr.completed_lessons / NULLIF(tl.total_lessons, 0))::int, 0
            ) AS progress,
            COALESCE(pr.last_completed_at, me.enrolled_at) AS last_activity
        FROM my_enrollments me
        JOIN courses c ON c.id = me.course
        CROSS JOIN LATERAL (
          SELECT COUNT(*)::int AS total_lessons
          FROM lessons l
          WHERE l.course = c.id
        ) tl
        CROSS JOIN LATERAL (
          SELECT COUNT(DISTINCT lp.lesson)::int AS completed_lessons,
                MAX(lp.completed_at) AS last_completed_at
          FROM lesson_progress lp
          JOIN lessons l ON l.id = lp.lesson AND l.course = c.id
          WHERE lp.user_id = $1 AND lp.completed
        ) pr
        WHERE c.status = 'published'
          AND COALESCE(c.is_banned, false) = false
          AND c.owner <> $1
          AND (tl.total_lessons = 0 OR pr.completed_lessons < tl.total_lessons)
        ORDER BY last_activity DESC
        LIMIT 5`,
      [id],
    );
    courses = rows;
  }

  if (!courses || courses.length === 0) {
    category = "suggested";
    const { rows } = await query(
      `SELECT ${card_columns}, c.id
      FROM courses c
      WHERE c.status = 'published'
        AND COALESCE(c.is_banned, false) = false
        AND ($1::int IS NULL OR c.owner <> $1::int)
        AND ($1::int IS NULL OR NOT EXISTS (
              SELECT 1 FROM enrollments e
              WHERE e.user_id = $1::int AND e.course = c.id))
      ORDER BY (COALESCE(c.rating_sum, 0) + 35.0) / (COALESCE(c.rating_count, 0) + 10)
              + 0.5 * LN(1 + COALESCE(c.students_enrolled, 0)) DESC,
              c.id
      LIMIT 5`,
      [id],
    );
    courses = rows;
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, { category, courses }, "Courses found successfully"),
    );
});

const getHomeCourses = asyncHandler(async (req: Request, res: Response) => {
  const id = req.user?.id || null;

  const parsed = getHomeCoursesSchema.safeParse(req.query);
  if (!parsed.success) {
    const errors = parsed.error.issues.map((item) => item.message);
    throw new ApiError(400, "Validation Error", errors);
  }

  const { category, skill, variant } = parsed.data;

  let sql = "";
  let params: unknown[] = [];
  let categories: string[] | undefined = undefined;
  let skills: string[] | undefined = undefined;

  const columns =
    "id, cover, name, tagline, category, skills, lessons, students_enrolled, price, rating_sum, rating_count";

  const available = `c.status = 'published' AND NOT c.is_banned AND NOT EXISTS (
    SELECT 1 FROM enrollments e
    WHERE e.course = c.id AND e.user_id = $1
  )`;

  const rankC = `c.rating_sum::float / NULLIF(c.rating_count, 0) DESC NULLS LAST, c.students_enrolled DESC`;
  const rank = `rating_sum::float / NULLIF(rating_count, 0) DESC NULLS LAST, students_enrolled DESC`;

  if (variant === "category") {
    const { rows } = await query(
      `SELECT category
      FROM courses c
      WHERE c.status = 'published' AND NOT c.is_banned
      GROUP BY category
      ORDER BY COUNT(*) DESC`,
    );

    categories = rows?.map((r) => r?.category);
    params = [id, category];

    sql = `SELECT ${columns} FROM (
        SELECT c.*, ROW_NUMBER() OVER (
          PARTITION BY c.category ORDER BY ${rankC}
        ) AS rn
        FROM courses c
        WHERE ${available}
          AND ($2::text IS NULL OR c.category = $2)
      ) t
      ORDER BY rn, ${rank}
      LIMIT 4`;
  }

  if (variant === "skills") {
    const { rows } = await query(
      `SELECT s AS skill
      FROM courses c, unnest(c.skills) AS s
      WHERE c.status = 'published' AND NOT c.is_banned
      GROUP BY s
      ORDER BY COUNT(*) DESC`,
    );

    skills = rows?.map((s) => s?.skill);
    params = [id, skill];

    sql = `SELECT ${columns} FROM (
        SELECT DISTINCT ON (id) * FROM (
          SELECT c.*, ROW_NUMBER() OVER (
            PARTITION BY s ORDER BY ${rankC}
          ) AS rn
          FROM courses c, unnest(c.skills) AS s
          WHERE ${available}
            AND ($2::text IS NULL OR s = $2)
        ) x
        ORDER BY id, rn
      ) t
      ORDER BY rn, ${rank}
      LIMIT 4`;
  }

  if (variant === "recommended") {
    sql = `SELECT ${columns}
    FROM courses c
    WHERE ${available}
      ORDER BY
        (c.category IN (
          SELECT c2.category FROM enrollments e2
          JOIN courses c2 ON c2.id = e2.course
          WHERE e2.user_id = $1
        )) DESC,
        ${rankC}
        LIMIT 4`;
    params = [id];
  }

  if (variant === "free") {
    sql = `SELECT ${columns}
    FROM courses c
      WHERE ${available} AND c.price = 0
      ORDER BY
        (c.category IN (
          SELECT c2.category FROM enrollments e2
          JOIN courses c2 ON c2.id = e2.course
          WHERE e2.user_id = $1
          )) DESC,
        ${rankC}
        LIMIT 4`;
    params = [id];
  }

  const { rows: courses } = await query(sql, params);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { courses, skills, categories },
        "Courses found successfully",
      ),
    );
});

const getCourses = asyncHandler(async (req: Request, res: Response) => {
  const id = req.user?.id;

  const parsed = getCoursesSchema.safeParse(req.query);
  if (!parsed.success) {
    const errors = parsed.error.issues.map((err) => err.message);
    throw new ApiError(400, "Validation error", errors);
  }

  const {
    categories,
    page,
    limit,
    search,
    rating,
    sort,
    minPrice,
    maxPrice,
    minLessons,
    maxLessons,
  } = parsed.data;

  const orderByMap: Record<string, string> = {
    "latest": "created_at DESC",
    "popular": "students DESC",
    "price-low": "price ASC",
    "price-high": "price DESC",
  };

  const orderBy = orderByMap[sort];

  const { rows: courses } = await query(
    `SELECT id, name, description, tagline, owner, is_banned, status, students_enrolled, ban_reason, skills, cover, category, price, rating_sum, rating_count, lessons, created_at,
     COUNT(*) OVER() AS total_count
     FROM courses
     WHERE ($1::text[] IS NULL OR category = ANY($1::text[]))
     AND ($2::int IS NULL OR price >= $2)
     AND ($3::int IS NULL OR price <= $3)
     AND ($4::numeric IS NULL OR (rating_sum::numeric / NULLIF(rating_count, 0)) >= $4)
     AND ($5::int IS NULL OR lessons >= $5)
     AND ($6::int IS NULL OR lessons <= $6)
     AND ($7::text IS NULL OR name ILIKE '%' || $7 || '%')
     AND status = 'published'
     AND NOT is_banned 
     AND NOT ($8::int IS NULL OR owner = $8)
     ORDER BY ${orderBy}
     OFFSET ${(page - 1) * limit} ROWS
     LIMIT ${limit}`,
    [
      categories?.split(",") ?? null,
      minPrice ?? null,
      maxPrice ?? null,
      rating ?? null,
      minLessons ?? null,
      maxLessons ?? null,
      search ?? null,
      id ?? null,
    ],
  );

  const { rows: filters } = await query(
    `
    SELECT
      MAX(price) AS "max_price",
      MAX(lessons) AS "max_lessons",
      ARRAY_AGG(DISTINCT category ORDER BY category) FILTER (WHERE category IS NOT NULL) AS categories
    FROM courses
    WHERE status = 'published' AND NOT is_banned AND NOT ($1::int IS NULL OR owner = $1)`,
    [id],
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        courses: courses.map(({ total_count, ...course }) => course),
        pagination: {
          page,
          limit,
          total: parseInt(courses[0]?.total_count) || 0,
          pages: Math.ceil(courses[0]?.total_count / limit),
        },
        filters: filters[0],
      },
      "Courses found successfully",
    ),
  );
});

const getCourse = asyncHandler(async (req: Request, res: Response) => {
  const id = req.user?.id;
  const role = req.user?.role;
  if (!id) throw new ApiError(401, "Unauthorized request", ["UNAUTHORIZED"]);

  const parsed = courseIdSchema.safeParse(req.params);
  if (!parsed.success) {
    const errors = parsed.error.issues.map((err) => err.message);
    throw new ApiError(400, "Validation error", errors);
  }

  const { courseId } = parsed.data;

  const { rows: course } = await query(
    `SELECT c.*, i.name AS owner_name, i.avatar as owner_avatar 
      FROM courses c
      JOIN users i ON c.owner = i.id
      WHERE c.id = $1`,
    [courseId],
  );

  if (!course[0]) {
    throw new ApiError(404, "Course not found", ["COURSE_NOT_FOUND"]);
  }

  if (role === "instructor" && course[0]?.owner !== id) {
    throw new ApiError(401, "Unauthorized request", ["UNAUTHORIZED"]);
  }

  if (course[0]?.is_banned) {
    throw new ApiError(403, "Course not available", ["COURSE_BANNED"]);
  }

  return res
    .status(200)
    .json(new ApiResponse(200, course[0], "Course found successfully"));
});

const getEnrolledCourses = asyncHandler(async (req: Request, res: Response) => {
  const id = req.user?.id;
  if (!id) throw new ApiError(401, "Unauthorized request", ["UNAUTHORIZED"]);

  const { rows: courses } = await query(
    `SELECT c.* 
    FROM courses c 
    JOIN enrollments e ON e.course = c.id 
    WHERE e.user_id = $1 AND status = 'published' AND NOT is_banned`,
    [id],
  );

  return res
    .status(200)
    .json(new ApiResponse(200, courses, "Enrolled courses found successfully"));
});

const getOwnedCourses = asyncHandler(async (req: Request, res: Response) => {
  const id = req.user?.id;
  const role = req.user?.role;
  if (!id || role !== "instructor") {
    throw new ApiError(401, "Unauthorized request", ["UNAUTHORIZED"]);
  }

  const { rows: courses } = await query(
    "SELECT * FROM courses WHERE owner = $1",
    [id],
  );

  return res
    .status(200)
    .json(new ApiResponse(200, courses, "Owned courses found"));
});

const getTopEarningCourses = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.user?.id;
    const role = req.user?.role;
    if (!id || role !== "instructor") {
      throw new ApiError(401, "Unauthorized request", ["UNAUTHORIZED"]);
    }

    const { rows: courses } = await query(
      `SELECT c.id, c.cover, c.name, c.tagline, c.price, COUNT(e.id) AS enrollments, COUNT(e.id) * c.price AS earnings
      FROM courses c
      JOIN enrollments e ON e.course = c.id
      WHERE c.owner = $1
      GROUP BY c.id, c.cover, c.name, c.tagline, c.price
      ORDER BY earnings DESC
      LIMIT 3`,
      [id],
    );

    return res
      .status(200)
      .json(new ApiResponse(200, courses, "Top Earning courses found"));
  },
);

const createCourse = asyncHandler(async (req: Request, res: Response) => {
  const id = req.user?.id;
  const role = req.user?.role;
  if (!id || role !== "instructor") {
    throw new ApiError(401, "Unauthorized request", ["UNAUTHORIZED"]);
  }

  const parsed = createCourseSchema.safeParse(req.body);
  if (!parsed.success) {
    const errors = parsed.error.issues.map((err) => err.message);
    throw new ApiError(400, "Validation error", errors);
  }

  const { name, tagline, description, category, price, skills, status } =
    parsed.data;

  const coverImage = req.file;
  if (!coverImage?.path) {
    throw new ApiError(400, "Cover image is required", [
      "COVER_IMAGE_REQUIRED",
    ]);
  } else if (coverImage.size > 50_000_000) {
    // File greater than 50MB
    throw new ApiError(400, "Cover image cannot be larger than 50MB", [
      "IMAGE_SIZE",
    ]);
  }

  const coverImageUrl = await uploadToCloudinary(coverImage.path, "course");
  if (!coverImageUrl) {
    throw new ApiError(500, "Failed to upload cover image", ["UPLOAD_FAILED"]);
  }

  const { rows: course } = await query(
    `INSERT INTO courses(name, tagline, description, cover, category, owner, price, skills, status)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING *`,
    [
      name,
      tagline,
      description,
      coverImageUrl,
      category,
      id,
      price,
      typeof skills === "string" ? [skills] : skills,
      status,
    ],
  );

  if (!course[0]) {
    throw new ApiError(500, "Failed to create course", ["ACTION_FAILED"]);
  }

  return res
    .status(200)
    .json(new ApiResponse(200, course[0], "Course created successfully"));
});

const editCourse = asyncHandler(async (req: Request, res: Response) => {
  const id = req.user?.id;
  const role = req.user?.role;
  if (!id || role !== "instructor") {
    throw new ApiError(401, "Unauthorized request", ["UNAUTHORIZED"]);
  }

  const coverImage = req.file;
  const parsed = createCourseSchema
    .partial()
    .refine(
      (data) =>
        Object.values({ ...data, cover: coverImage?.path }).some(
          (value) => value !== undefined,
        ),
      { message: "At least one field must be provided" },
    )
    .safeParse(req.body);
  if (!parsed.success) {
    const errors = parsed.error.issues.map((err) => err.message);
    throw new ApiError(400, "Validation error", errors);
  }

  const { name, description, category, price, skills, status } = parsed.data;
  const parsedCourseId = courseIdSchema.safeParse(req.params);
  if (!parsedCourseId.success) {
    const errors = parsedCourseId.error.issues.map((err) => err.message);
    throw new ApiError(400, "Validation error", errors);
  }

  const { courseId } = parsedCourseId.data;

  let coverImageUrl: string | undefined = undefined;
  if (coverImage) {
    if (coverImage.size > 50_000_000) {
      // File greater than 50MB
      throw new ApiError(400, "Cover image cannot be larger than 50MB", [
        "IMAGE_SIZE",
      ]);
    }

    coverImageUrl = await uploadToCloudinary(coverImage?.path, "course");
    if (!coverImageUrl) {
      throw new ApiError(400, "Failed to upload cover image", [
        "UPLOAD_FAILED",
      ]);
    }
  }

  const { rows: courseExists } = await query(
    "SELECT owner, cover FROM courses WHERE id = $1",
    [courseId],
  );
  if (!courseExists[0]) {
    throw new ApiError(404, "Course not found", ["COURSE_NOT_FOUND"]);
  }

  if (courseExists[0]?.owner !== id) {
    throw new ApiError(401, "You are not the owner of this course", [
      "UNAUTHORIZED",
    ]);
  }

  if (coverImageUrl) {
    const cover: string = courseExists[0]?.cover;
    const publicId = "lms" + cover?.split("/lms")[1]?.split(".")[0];
    await deleteFromCloudinary(publicId);
  }

  const { rows: course } = await query(
    `UPDATE courses 
    SET name = COALESCE($1::text, name),
        description = COALESCE($2::text, description),
        category = COALESCE($3::text, category),
        price = COALESCE($4::int, price),
        skills = COALESCE($5::text[], skills),
        status = COALESCE($6::text, status),
        cover = COALESCE($7::text, cover)
    WHERE id = $8
    RETURNING *`,
    [
      name ?? null,
      description ?? null,
      category ?? null,
      price ?? null,
      skills ?? null,
      status ?? null,
      coverImageUrl ?? null,
      courseId,
    ],
  );
  if (!course[0]) {
    throw new ApiError(500, "Failed to update course", ["ACTION_FAILED"]);
  }

  return res
    .status(200)
    .json(new ApiResponse(200, course[0], "Course updated successfully"));
});

const discardDraft = asyncHandler(async (req: Request, res: Response) => {
  const id = req.user?.id;
  const role = req.user?.role;
  if (!id || role !== "instructor") {
    throw new ApiError(401, "Unauthorized request", ["UNAUTHORIZED"]);
  }

  const parsed = courseIdSchema.safeParse(req.params);
  if (!parsed.success) {
    const errors = parsed.error.issues.map((err) => err.message);
    throw new ApiError(400, "Validation error", errors);
  }

  const { courseId } = parsed.data;

  const { rows: course } = await query(
    `SELECT owner FROM courses WHERE id = $1`,
    [courseId],
  );

  if (!course) {
    throw new ApiError(404, "Course not found", ["COURSE_NOT_FOUND"]);
  }

  if (course[0]?.owner !== id) {
    throw new ApiError(401, "You are not authorized to discard this draft", [
      "UNAUTHORIZED",
    ]);
  }

  if (course[0]?.status !== "draft") {
    throw new ApiError(400, "Course not a draft", ["NOT_DRAFT"]);
  }

  const { rows: discardedDraft } = await query(
    "DELETE FROM courses WHERE id = $1 RETURNING name",
    [courseId],
  );

  if (!discardedDraft) {
    throw new ApiError(400, "Cannot discard course", ["ACTION_FAILED"]);
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, discardedDraft[0], "Draft discarded successfully"),
    );
});

const enrollFreeCourse = asyncHandler(async (req: Request, res: Response) => {
  const id = req.user?.id;
  const role = req.user?.role;
  if (!id || role !== "student") {
    throw new ApiError(401, "Unauthorized request", ["UNAUTHORIZED"]);
  }

  const parsed = courseIdSchema.safeParse(req.params);
  if (!parsed.success) {
    const errors = parsed.error.issues.map((err) => err.message);
    throw new ApiError(400, "Validation error", errors);
  }

  const { courseId } = parsed.data;

  const { rows: enrollmentExists } = await query(
    "SELECT * FROM enrollments WHERE course = $1 AND user_id = $2",
    [courseId, id],
  );
  if (enrollmentExists[0]) {
    throw new ApiError(400, "You are already enrolled to this course", [
      "ALREADY_ENROLLED",
    ]);
  }

  const { rows: course } = await query(
    "SELECT price, is_banned, ban_reason, status FROM courses WHERE id = $1",
    [courseId],
  );

  if (course[0]?.price !== 0) {
    throw new ApiError(400, "You cannot enroll to this course", [
      "CANNOT_ENROLL",
    ]);
  }

  if (course[0]?.is_banned) {
    throw new ApiError(403, "Course not available to enroll", [
      "COURSE_BANNED",
    ]);
  }

  await query("BEGIN");

  const { rows: enrollment } = await query(
    "INSERT INTO enrollments(course, user_id) VALUES ($1, $2) RETURNING *",
    [courseId, id],
  );

  if (!enrollment[0]) {
    await query("ROLLBACK");
    throw new ApiError(500, "Failed to enroll into the course", [
      "ACTION_FAILED",
    ]);
  }

  await query("UPDATE courses SET students_enrolled = students_enrolled + 1");
  await query("COMMIT");

  return res
    .status(200)
    .json(new ApiResponse(200, enrollment[0], "Enrollment successful"));
});

export {
  getSearchSuggestions,
  getCourses,
  getCourse,
  getEnrolledCourses,
  getHomeCourses,
  getCarouselCards,
  getTopEarningCourses,
  getInstructorCourses,
  enrollFreeCourse,
  discardDraft,
  getOwnedCourses,
  createCourse,
  editCourse,
};
