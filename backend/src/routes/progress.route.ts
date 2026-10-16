import { Router } from "express";
import {
  getProgress,
  markLessonComplete,
  markLessonIncomplete,
} from "../controllers/progress.controller";
import verifyJWT from "../middlewares/auth.middleware";

const router = Router();

router.use(verifyJWT);

router.get("/", getProgress);

router.post("/mark-complete", markLessonComplete);

router.put("/mark-incomplete", markLessonIncomplete);

export default router;
