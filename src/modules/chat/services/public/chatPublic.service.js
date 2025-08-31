import { setupGroupChatSocket } from "../../socket/chat.socket.js";


export const ChatPublicService = {
   initGroupChat(io, socket) {
      return setupGroupChatSocket(io, socket);
   }
}