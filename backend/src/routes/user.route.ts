import { Router } from "express";
import {
  becomeInstructor,
  getUser,
  onboardUser,
  removeAvatar,
  updateAvatar,
  updatePassword,
} from "../controllers/user.controller";
import verifyJWT from "../middlewares/auth.middleware";
import upload from "../middlewares/multer.middleware";

const router = Router();

router.use(verifyJWT);

router.get("/", getUser);

router.put("/become-instructor", becomeInstructor);

router.put("/onboard", onboardUser);

router.route("/update-avatar").put(upload.single("avatar"), updateAvatar);

router.put("/remove-avatar", removeAvatar);

router.put("/update-password", updatePassword);

export default router;
