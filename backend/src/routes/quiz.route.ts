import { Router } from "express";
import { getQuiz } from "../controllers/quiz.controller";
import verifyJWT from "../middlewares/auth.middleware";

const router = Router();

router.use(verifyJWT);

router.get("/:lessonId", getQuiz);

export default router;
