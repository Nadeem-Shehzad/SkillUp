import express from "express";

import { ValidateToken } from "../../../middlewares/validateToken.js";
import { checkMessageOwner, checkUserAndEligibility } from "../middlewares/external.middlewares.js";

import {
   deleteGroupMessages,
   getGroupMessages,
   getMyGroups,
   sendGroupMessage,
} from "../controllers/groupChat.controller.js";

const router = express.Router();


router.route("/get-my-groups").get(
   ValidateToken,
   getMyGroups
);


router.route("/send-group-message/:courseId").post(
   ValidateToken,
   checkUserAndEligibility,
   sendGroupMessage
);


router.route("/get-group-messages/:courseId").get(
   ValidateToken,
   checkUserAndEligibility,
   getGroupMessages
);


router.route("/del-group-message/:courseId").delete(
   ValidateToken,
   checkUserAndEligibility,
   checkMessageOwner,
   deleteGroupMessages
);


export { router as groupChatRouter };