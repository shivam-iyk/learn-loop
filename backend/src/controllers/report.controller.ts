import { Request, Response } from "express";
import asyncHandler from "../utils/AsyncHandler";
import ApiError from "../utils/ApiError";
import { query } from "../db";
import ApiResponse from "../utils/ApiResponse";
import {
  addCommentSchema,
  createReportSchema,
  updateStatusSchema,
} from "../schemas/report.schema";
import { uploadToCloudinary } from "../utils/cloudinary";

const getReports = asyncHandler(async (req: Request, res: Response) => {
  const id = req.user?.id;
  if (!id) throw new ApiError(401, "Unauthorized request");

  const { rows: reports } = await query(
    "SELECT * FROM reports WHERE user_id = $1",
    [id],
  );
  if (!reports) {
    throw new ApiError(400, "No reports found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, reports, "Reports found successfully"));
});

const createReport = asyncHandler(async (req: Request, res: Response) => {
  const id = req.user?.id;
  if (!id) throw new ApiError(401, "Unauthorized request");

  const parsed = createReportSchema.safeParse(req.body);
  if (!parsed.success) {
    const errors = parsed.error.issues.map((err) => err.message);
    throw new ApiError(400, "Validation Error", errors);
  }

  const { issue, problem } = parsed.data;

  const image = req.file;
  let url: string | null = null;
  if (image) {
    const imageUrl = await uploadToCloudinary(image.path, "reports");
    if (imageUrl) url = imageUrl;
  }

  const { rows: report } = await query(
    "INSERT INTO reports (issue, problem, user_id, image) VALUES ($1, $2, $3)",
    [issue, problem, id, url],
  );

  return res
    .status(200)
    .json(new ApiResponse(200, report, "Report created successfully"));
});

const addComment = asyncHandler(async (req: Request, res: Response) => {
  const id = req.user?.id;
  if (!id || req.user?.role !== "admin") {
    throw new ApiError(401, "Unauthorized request");
  }

  const { reportId } = req.params;

  if (!reportId || typeof reportId !== "string" || isNaN(parseInt(reportId))) {
    throw new ApiError(400, "Report ID is required");
  }

  const parsed = addCommentSchema.safeParse(req.body);
  if (!parsed.success) {
    const errors = parsed.error.issues.map((err) => err.message);
    throw new ApiError(400, "Validation Error", errors);
  }
  const { comment } = parsed.data;

  await query("UPDATE reports SET comment = $1 WHERE id = $2", [
    comment,
    reportId,
  ]);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Comments added successfully"));
});

const updateStatus = asyncHandler(async (req: Request, res: Response) => {
  const id = req.user?.id;
  if (!id || req.user?.role !== "admin") {
    throw new ApiError(401, "Unauthorized request");
  }

  const { reportId } = req.params;

  if (!reportId || typeof reportId !== "string" || isNaN(parseInt(reportId))) {
    throw new ApiError(400, "Report ID is required");
  }

  const parsed = updateStatusSchema.safeParse(req.body);
  if (!parsed.success) {
    const errors = parsed.error.issues.map((err) => err.message);
    throw new ApiError(400, "Validation Error", errors);
  }
  const { status } = parsed.data;

  await query("UPDATE reports SET status = $1 WHERE id = $2", [
    status,
    reportId,
  ]);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Status updated successfully"));
});

export { getReports, createReport, addComment, updateStatus };
