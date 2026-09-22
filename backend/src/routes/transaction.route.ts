import { Router } from "express";
import verifyJWT from "../middlewares/auth.middleware";
import {
  getInstructorTransactions,
  initiatePayment,
  verifyPayment,
} from "../controllers/transaction.controller";

const router = Router();

router.use(verifyJWT);

router.get("/instructor", getInstructorTransactions);

router.post("/initiate/:courseId", initiatePayment);

router.post("/verify", verifyPayment);

export default router;
