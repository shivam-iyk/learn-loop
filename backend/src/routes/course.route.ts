import { Router } from "express";
import {
  createCourse,
  editCourse,
  enrollFreeCourse,
  getCourse,
  getCourses,
  getEnrolledCourses,
  getOwnedCourses,
  getSuggestions,
} from "../controllers/course.controller";
import verifyJWT from "../middlewares/auth.middleware";
import upload from "../middlewares/multer.middleware";

const router = Router();

router.get("/", getCourses);

router.get("/suggestions", getSuggestions);

router.use(verifyJWT);

router.get("/enrolled", getEnrolledCourses);

router.get("/owned", getOwnedCourses);

router.route("/create").post(upload.single("cover"), createCourse);

router.route("/edit/:courseId").put(upload.single("cover"), editCourse);

router.post("/enroll/:courseId", enrollFreeCourse);

router.get("/:courseId", getCourse);

export default router;
