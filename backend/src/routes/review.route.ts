import { Router } from "express";
import {
  deleteReview,
  editReview,
  getReviews,
  postReview,
} from "../controllers/review.controller";
import verifyJWT from "../middlewares/auth.middleware";

const router = Router();

router.use(verifyJWT);

router.get("/:courseId", getReviews);

router.post("/", postReview);

router.put("/:reviewId", editReview);

router.delete("/:reviewId", deleteReview);

export default router;
