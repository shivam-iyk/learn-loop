import { Request, Response } from "express";
import ApiError from "../utils/ApiError";
import asyncHandler from "../utils/AsyncHandler";
import { query } from "../db";
import ApiResponse from "../utils/ApiResponse";
import { createCourseSchema, getCoursesSchema } from "../schemas/course.schema";
import { deleteFromCloudinary, uploadToCloudinary } from "../utils/cloudinary";

const getCourses = asyncHandler(async (req: Request, res: Response) => {
  const parsed = getCoursesSchema.safeParse(req.query);
  console.log(req.query);
  if (!parsed.success) {
    const errors = parsed.error.issues.map((err) => err.message);
    throw new ApiError(400, "Validation error", errors);
  }

  const {
    category,
    page,
    limit,
    search,
    sort,
    minPrice,
    maxPrice,
    minRatings,
    maxRatings,
    minDuration,
    maxDuration,
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
    `SELECT id, name, description, owner, level, is_banned, status, students_enrolled, ban_reason, skills, cover, category, price, rating_sum, rating_count, duration, lessons, created_at,
     COUNT(*) OVER() AS total_count
     FROM courses
     WHERE ($1::text IS NULL OR category = $1)
     AND ($2::int IS NULL OR price >= $2)
     AND ($3::int IS NULL OR price <= $3)
     AND ($4::numeric IS NULL OR (rating_sum::numeric / NULLIF(rating_count, 0)) >= $4)
     AND ($5::numeric IS NULL OR (rating_sum::numeric / NULLIF(rating_count, 0)) <= $5)
     AND ($6::int IS NULL OR duration >= $6)
     AND ($7::int IS NULL OR duration <= $7)
     AND ($8::int IS NULL OR lessons >= $8)
     AND ($9::int IS NULL OR lessons <= $9)
     AND ($10::text IS NULL OR name ILIKE '%' || $10 || '%')
     ORDER BY ${orderBy}
     SKIP ${page * limit}
     LIMIT ${limit}`,
    [
      category ?? null,
      minPrice ?? null,
      maxPrice ?? null,
      minRatings ?? null,
      maxRatings ?? null,
      minDuration ?? null,
      maxDuration ?? null,
      minLessons ?? null,
      maxLessons ?? null,
      search ?? null,
    ],
  );

  if (!courses[0]) {
    throw new ApiError(400, "No courses found", ["NOT_FOUND"]);
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        courses: courses.map(({ total_count, ...course }) => course),
        pagination: {
          page,
          total: courses[0]?.total_count,
          pages: Math.ceil(courses[0]?.total_count / limit),
        },
      },
      "Courses found successfully",
    ),
  );
});

const getCourse = asyncHandler(async (req: Request, res: Response) => {
  const id = req.user?.id;
  const role = req.user?.role;
  if (!id) throw new ApiError(401, "Unauthorized request", ["UNAUTHORIZED"]);

  const { courseId } = req.params;
  if (!courseId || typeof courseId !== "string" || isNaN(parseInt(courseId))) {
    throw new ApiError(400, "Course Id is required", ["COURSE_ID_REQUIRED"]);
  }

  const { rows: course } = await query(`
      SELECT c.id, c.name, c.cover, c.level, c.description, c.students_enrolled, c.owner, c.duration, c.skills, c.is_banned, c.status, c.ban_reason, c.category, c.price, c.rating_sum, c.rating_count, c.lessons, c.created_at, i.name AS owner_name, i.avatar as owner_avatar 
      FROM courses c
      JOIN users i ON c.owner = i.id
      WHERE c.id = 2`);

  if (!course[0]) {
    throw new ApiError(404, "Course not found", ["NOT_FOUND"]);
  }

  if (role === "instructor" && course[0]?.owner !== id) {
    throw new ApiError(401, "Unauthorized request", ["UNAUTHORIZED"]);
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
    WHERE e.user_id = $1`,
    [id],
  );
  if (!courses[0]) {
    throw new ApiError(404, "No enrolled courses found", ["NOT_FOUND"]);
  }

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
  if (!courses[0]) {
    throw new ApiError(404, "No owned courses found", ["NOT_FOUND"]);
  }

  return res
    .status(200)
    .json(new ApiResponse(200, courses, "Owned courses found successfully"));
});

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

  const { name, description, category, level, price, skills, status } =
    parsed.data;

  const coverImage = req.file;
  if (!coverImage?.path) {
    throw new ApiError(400, "Cover image is required", [
      "COVER_IMAGE_REQUIRED",
    ]);
  }

  const coverImageUrl = await uploadToCloudinary(coverImage.path, "course");
  if (!coverImageUrl) {
    throw new ApiError(
      500,
      "Failed to upload cover image, Please try again later!",
      ["UPLOAD_FAILED"],
    );
  }

  const { rows: course } = await query(
    `INSERT INTO courses(name, description, cover, category, level, owner, price, skills, status)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING *
  `,
    [
      name,
      description,
      coverImageUrl,
      category,
      level,
      id,
      price,
      skills,
      status,
    ],
  );

  if (!course[0]) {
    throw new ApiError(
      500,
      "Failed to create course, Please try again later!",
      ["ACTION_FAILED"],
    );
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

  const { name, description, category, level, price, skills, status } =
    parsed.data;
  const { courseId } = req.params;

  if (!courseId || typeof courseId !== "string" || isNaN(parseInt(courseId))) {
    throw new ApiError(400, "Invalid course ID", ["INVALID_COURSE_ID"]);
  }

  let coverImageUrl: string | undefined = undefined;
  if (coverImage) {
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
    throw new ApiError(404, "Course not found", ["NOT_FOUND"]);
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
        level = COALESCE($7::text, level),
        cover = COALESCE($8::text, cover)
    WHERE id = $9
    RETURNING *`,
    [
      name ?? null,
      description ?? null,
      category ?? null,
      price ?? null,
      skills ?? null,
      status ?? null,
      level ?? null,
      coverImageUrl ?? null,
      courseId,
    ],
  );
  if (!course[0]) {
    throw new ApiError(
      500,
      "Failed to update course, Please try again later!",
      ["ACTION_FAILED"],
    );
  }

  return res
    .status(200)
    .json(new ApiResponse(200, course[0], "Course updated successfully"));
});

const enrollFreeCourse = asyncHandler(async (req: Request, res: Response) => {
  const id = req.user?.id;
  const role = req.user?.role;
  if (!id || role !== "student") {
    throw new ApiError(401, "Unauthorized request", ["UNAUTHORIZED"]);
  }

  const { courseId } = req.params;
  if (!courseId || typeof courseId !== "string" || isNaN(parseInt(courseId))) {
    throw new ApiError(400, "Invalid course id", ["INVALID_COURSE_ID"]);
  }

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
  getCourses,
  getCourse,
  getEnrolledCourses,
  enrollFreeCourse,
  getOwnedCourses,
  createCourse,
  editCourse,
};
