import { Router } from "express";
import {
  addComment,
  createReport,
  getReports,
  updateStatus,
} from "../controllers/report.controller";
import upload from "../middlewares/multer.middleware";

const router = Router();

router.get("/", getReports);

router.route("/").post(upload.single("image"), createReport);

router.put("/status/:reportId", updateStatus);

router.put("/comment/:reportId", addComment);

export default router;
