import { Router } from "express";
import {
  createCourse,
  discardDraft,
  editCourse,
  enrollFreeCourse,
  getCarouselCards,
  getCourse,
  getCourses,
  getEnrolledCourses,
  getHomeCourses,
  getInstructorCourses,
  getOwnedCourses,
  getSearchSuggestions,
  getTopEarningCourses,
} from "../controllers/course.controller";
import verifyJWT, { identifyUser } from "../middlewares/auth.middleware";
import upload from "../middlewares/multer.middleware";

const router = Router();

router.get("/", identifyUser, getCourses);

router.get("/search-suggestions", identifyUser, getSearchSuggestions);

router.get("/instructor/:instructorId", getInstructorCourses);

router.get("/home", identifyUser, getHomeCourses);

router.get("/carousel", identifyUser, getCarouselCards);

router.use(verifyJWT);

router.get("/enrolled", getEnrolledCourses);

router.get("/owned", getOwnedCourses);

router.get("/top-earning", getTopEarningCourses);

router.delete("/draft/:courseId", discardDraft);

router.route("/create").post(upload.single("cover"), createCourse);

router.route("/edit/:courseId").put(upload.single("cover"), editCourse);

router.post("/enroll/:courseId", enrollFreeCourse);

router.get("/:courseId", getCourse);

export default router;
