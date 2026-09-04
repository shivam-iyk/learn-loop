import { Request, Response } from "express";
import asyncHandler from "../utils/AsyncHandler";
import ApiError from "../utils/ApiError";
import { query } from "../db";
import ApiResponse from "../utils/ApiResponse";
import { postReviewSchema } from "../schemas/review.schema";

const getReviews = asyncHandler(async (req: Request, res: Response) => {
  const id = req.user?.id;
  if (!id) throw new ApiError(400, "Unauthorized request", ["UNAUTHORIZED"]);

  const { courseId } = req.params;
  if (!courseId || typeof courseId !== "string" || isNaN(parseInt(courseId))) {
    throw new ApiError(400, "Course ID is required", ["COURSE_ID_REQUIRED"]);
  }

  const { rows: reviews } = await query(
    `SELECT r.*, u.avatar AS user_avatar, u.name AS user_name
     FROM reviews r 
     JOIN users u 
     ON u.id = r.user_id 
     WHERE r.course = $1`,
    [courseId],
  );
  if (!reviews[0]) {
    throw new ApiError(404, "No reviews found for this course", ["NOT_FOUND"]);
  }

  return res
    .status(200)
    .json(new ApiResponse(200, reviews, "Reviews fetched successfully"));
});

const postReview = asyncHandler(async (req: Request, res: Response) => {
  const id = req.user?.id;
  if (!id) throw new ApiError(400, "Unauthorized request", ["UNAUTHORIZED"]);

  const parsed = postReviewSchema.safeParse(req.body);
  if (!parsed.success) {
    const errors = parsed.error.issues.map((err) => err.message);
    throw new ApiError(400, "Validation Error", errors);
  }

  const { course: courseId, review: reviewContent, rating } = parsed.data;

  const { rows: duplicateReview } = await query(
    "SELECT * FROM reviews WHERE course = $1 AND user_id = $2",
    [courseId, id],
  );
  if (duplicateReview[0]) {
    throw new ApiError(400, "You have already reviewed this course", ["ALREADY_SATISFIED"]);
  }

  await query(
    `UPDATE courses SET 
    rating_sum = rating_sum + $1, 
    rating_count = rating_count + 1 
    WHERE id = $2 RETURNING *`,
    [rating, courseId],
  );

  const { rows: review } = await query(
    "INSERT INTO reviews(course, user_id, review, rating) VALUES ($1, $2, $3, $4) RETURNING *",
    [courseId, id, reviewContent, rating],
  );

  if (!review[0]) {
    throw new ApiError(500, "Failed to post review, Please try again later!", ["ACTION_FAILED"]);
  }

  return res
    .status(200)
    .json(new ApiResponse(200, review[0], "Review posted successfully"));
});

const editReview = asyncHandler(async (req: Request, res: Response) => {
  const id = req.user?.id;
  if (!id) throw new ApiError(401, "Unauthorized request", ["UNAUTHORIZED"]);

  const { reviewId } = req.params;
  if (!reviewId || typeof reviewId !== "string" || isNaN(parseInt(reviewId))) {
    throw new ApiError(400, "Review ID is required");
  }

  const parsed = postReviewSchema
    .partial()
    .refine((data) => Object.values(data).some((v) => v !== undefined), {
      message: "At least one field is required",
    })
    .safeParse(req.body);
  if (!parsed.success) {
    const errors = parsed.error.issues.map((err) => err.message);
    throw new ApiError(400, "Validation Error", errors);
  }

  const { rating, review: reviewContent } = parsed.data;

  const { rows: reviewExists } = await query(
    "SELECT rating, course FROM reviews WHERE id = $1",
    [reviewId],
  );

  if (!reviewExists[0]) {
    throw new ApiError(404, "Review not found", ["NOT_FOUND"]);
  }

  const { rows: review } = await query(
    `UPDATE reviews
     SET rating = COALESCE($1::int, rating), 
     review = COALESCE($2::text, review) 
     WHERE id = $3 RETURNING *`,
    [rating, reviewContent, reviewId],
  );
  if (!review) {
    throw new ApiError(500, "Failed to edit review, Please try again later!");
  }

  if (rating) {
    await query(
      `UPDATE courses SET 
      rating_sum = rating_sum - $1 + $2
      WHERE id = $3`,
      [reviewExists[0]?.rating, rating, reviewExists[0]?.course],
    );
  }

  return res
    .status(200)
    .json(new ApiResponse(200, review[0], "Review edited successfully"));
});

const deleteReview = asyncHandler(async (req: Request, res: Response) => {
  const id = req.user?.id;
  if (!id) throw new ApiError(400, "Unauthorized request", ["UNAUTHORIZED"]);

  const { reviewId } = req.params;
  if (!reviewId || typeof reviewId !== "string" || isNaN(parseInt(reviewId))) {
    throw new ApiError(400, "Review ID is required", ["REVIEW_ID_REQUIRED"]);
  }

  const { rows: review } = await query(
    "SELECT rating, course, user_id FROM reviews WHERE id = $1",
    [reviewId],
  );

  if (!review[0]) {
    throw new ApiError(404, "Review not found", ["NOT_FOUND"]);
  }

  if (review[0]?.user_id !== id) {
    throw new ApiError(401, "You are not authorized to delete this review", ["UNAUTHORIZED"]);
  }

  await query("BEGIN");
  await query(
    `UPDATE courses SET 
    rating_sum = rating_sum - $1, 
    rating_count = rating_count - 1 
    WHERE id = $2`,
    [review[0]?.rating, review[0]?.course],
  );

  await query("DELETE FROM reviews WHERE id = $1", [reviewId]);
  await query("COMMIT");

  return res
    .status(200)
    .json(new ApiResponse(200, review[0], "Review deleted successfully"));
});

export { getReviews, postReview, editReview, deleteReview };
