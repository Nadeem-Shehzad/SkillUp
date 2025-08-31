import { ChatPublicService } from "../../../modules/chat/index.js";


export const ChatClientService = {
   setupGroupChat(io, socket) {
      return ChatPublicService.initGroupChat(io, socket);
   }
}