import { Router } from "express";
import {
  getInstructor,
  getInstructors,
  getOverview,
  getPopularInstructors,
} from "../controllers/instructor.controller";
import verifyJWT from "../middlewares/auth.middleware";

const router = Router();

router.use(verifyJWT);

router.get("/overview", getOverview);

router.get("/popular", getPopularInstructors);

router.get("/", getInstructors);

router.get("/:instructorId", getInstructor);

export default router;
