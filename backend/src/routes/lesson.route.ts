import { Router } from "express";
import {
  createLesson,
  deleteLesson,
  getLessons,
  reorderLessons,
  updateLesson,
} from "../controllers/lesson.controller";
import verifyJWT from "../middlewares/auth.middleware";

const router = Router();

router.use(verifyJWT);

router.post("/", createLesson);

router.get("/:courseId", getLessons);

router.put("/reorder", reorderLessons);

router.put("/:lessonId", updateLesson);

router.delete("/:lessonId", deleteLesson);

export default router;
