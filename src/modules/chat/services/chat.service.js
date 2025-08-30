import { Chat } from "../model/chat.model.js";


export const saveMessageService = async ({ senderId, receiverId, message }) => {
   const chat = await Chat.create({ senderId, receiverId, message });
   return chat;
};


export const getConversationService = async (user1, user2) => {
   return await Chat.find({
      $or: [
         { senderId: user1, receiverId: user2 },
         { senderId: user2, receiverId: user1 },
      ],
   }).sort({ createdAt: 1 });
};