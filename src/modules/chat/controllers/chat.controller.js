import {
   saveMessageService,
   getConversationService,
} from "../services/chat.service.js";

// POST /api/chat/send
export const sendMessage = async (req, res, next) => {
   try {
      const { senderId, receiverId, message } = req.body;

      const chat = await saveMessageService({ senderId, receiverId, message });

      res.status(201).json({
         success: true,
         data: chat,
      });
   } catch (err) {
      next(err);
   }
};

// GET /api/chat/:user1/:user2
export const getConversation = async (req, res, next) => {
   try {
      const { user1, user2 } = req.params;

      const conversation = await getConversationService(user1, user2);

      res.status(200).json({
         success: true,
         data: conversation,
      });
   } catch (err) {
      next(err);
   }
};