import jwt from 'jsonwebtoken';
import { JWT_SECRET } from "../config/index.js";
import { ApiError, constants } from '@skillup/common-utils';


export const socketAuth = (socket, next) => {
   try {
      const token = socket.handshake.query.token || socket.handshake.auth?.token;

      if (!token) {
         throw new ApiError(constants.UNAUTHORIZED,"token missing");
      }

      const decoded = jwt.verify(token, JWT_SECRET);;
      socket.user = decoded.user;   
      next();

   } catch (err) {
      next(err);
   }
};