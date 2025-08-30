import { logger } from "@skillup/common-utils";
import { socketAuth } from "./socketAuth.js";


export const setupSocket = (io) => {
   logger.info('inside setup.socket');
   io.use(socketAuth);

   io.on("connection", (socket) => {
      logger.info(`🔌 User connected userId=${socket.user.id}, socketId=${socket.id}`);

      socket.on("disconnect", () => {
         logger.warn("❌ Client disconnected id --> ", socket.id);
      });
   });
}