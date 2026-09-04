import { Router } from "express";
import verifyJWT from "../middlewares/auth.middleware";
import {
  initiatePayment,
  verifyPayment,
} from "../controllers/transaction.controller";

const router = Router();

router.use(verifyJWT);

router.post("/initiate/:courseId", initiatePayment);

router.post("/verify", verifyPayment);

export default router;
