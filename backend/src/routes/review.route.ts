import { Router } from "express";
import {
  deleteReview,
  editReview,
  getInstructorReviews,
  getReviews,
  postReview,
} from "../controllers/review.controller";
import verifyJWT from "../middlewares/auth.middleware";

const router = Router();

router.route("/instructor").get(verifyJWT, getInstructorReviews);

router.get("/:courseId", getReviews);

router.use(verifyJWT);

router.post("/", postReview);

router.put("/:reviewId", editReview);

router.delete("/:reviewId", deleteReview);

export default router;
