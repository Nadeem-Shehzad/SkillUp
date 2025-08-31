import { SocketPublicService } from "../../../../socket/index.js";


export const SocketClientService = {
   getIOSocketInstance() {
      return SocketPublicService.getIOSocketInstance();
   },

   getUsersSocketMap(){
      return SocketPublicService.getUsersSocketMap();
   }
}