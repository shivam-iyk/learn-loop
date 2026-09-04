import { Router } from "express";
import {
  forgotPassword,
  login,
  logout,
  register,
  resendVerificationCode,
  verifyMail,
} from "../controllers/auth.controller";

const router = Router();

router.post("/register", register);

router.post("/login", login);

router.put("/verify-mail", verifyMail);

router.put("/resend-code", resendVerificationCode);

router.put("/forgot-password", forgotPassword);

router.get("/logout", logout);

export default router;
