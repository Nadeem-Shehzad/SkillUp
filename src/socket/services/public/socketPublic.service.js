import { usersSocketMap } from "../../setup.js";
import { getSocketInstance } from "../../socketInstance.js";


export const SocketPublicService = {
   getIOSocketInstance() {
      return getSocketInstance();
   },

   getUsersSocketMap(){
      return usersSocketMap;
   }
}