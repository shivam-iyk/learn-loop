import { Router } from "express";
import {
  deleteMessage,
  editMessage,
  getChats,
  getMessages,
  sendMessage,
} from "../controllers/message.controller";
import upload from "../middlewares/multer.middleware";
import verifyJWT from "../middlewares/auth.middleware";

const router = Router();

router.use(verifyJWT);

router.get("/chats", getChats);

router.get("/:courseId", getMessages);

router.route("/send").post(upload.single("attachment"), sendMessage);

router.put("/:messageId", editMessage);

router.delete("/:messageId", deleteMessage);

export default router;
