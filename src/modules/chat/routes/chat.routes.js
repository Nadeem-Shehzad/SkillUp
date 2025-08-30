import express from "express";
import {
   sendMessage,
   getConversation,
} from "./chat.controller.js";

const router = express.Router();

router.post("/send", sendMessage);
router.get("/:user1/:user2", getConversation);

export { router as chatRouter };