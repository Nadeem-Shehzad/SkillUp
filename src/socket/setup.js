import { logger } from "@skillup/common-utils";
import { socketAuth } from "./socketAuth.js";
import { ChatClientService } from "./services/client/chatClient.service.js";

/** @type {Map<string, string>} */
export const usersSocketMap = new Map();

export const setupSocket = (io) => {
   io.use(socketAuth);

   io.on("connection", (socket) => {
      logger.info(`🔌 User connected userId --> ${socket.mainUserID}, socketId=${socket.id}`);

      usersSocketMap.set(socket.mainUserID.toString(), socket.id);
      ChatClientService.setupGroupChat(io, socket);

      socket.on("disconnect", () => {
         logger.warn("❌ Client disconnected id --> ", socket.id);
      });
   });
}