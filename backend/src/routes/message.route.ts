import { Router } from "express";
import {
  deleteMessage,
  editMessage,
  getChats,
  getMessages,
  sendMessage,
} from "../controllers/message.controller";
import upload from "../middlewares/multer.middleware";

const router = Router();

router.get("/chats", getChats);

router.get("/", getMessages);

router.route("/send").post(upload.single("attachment"), sendMessage);

router.put("/:messageId", editMessage);

router.delete("/:messageId", deleteMessage);

export default router;
