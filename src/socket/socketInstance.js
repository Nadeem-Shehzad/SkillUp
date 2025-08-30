import { ApiError, constants, logger } from "@skillup/common-utils";

let io;

export const setSocketInstance = (socketInstance) => {
   io = socketInstance;
   logger.info('✅ IO Setup ...');
};

export const getSocketInstance = () => {
   if (!io) throw new ApiError(constants.VALIDATION_ERROR, "Socket.io instance not initialized!");
   return io;
};