import jwt from 'jsonwebtoken';
import { JWT_SECRET } from "../config/index.js";
import { ApiError, constants } from '@skillup/common-utils';
import { StudentClientService } from './services/client/studentClient.service.js';
import { InstructorClientService } from './services/client/instructorClient.service.js';



export const socketAuth = async (socket, next) => {
   try {
      const token = socket.handshake.query.token || socket.handshake.auth?.token;

      if (!token) {
         throw new ApiError(constants.UNAUTHORIZED, "token missing");
      }

      const decoded = jwt.verify(token, JWT_SECRET);;

      if (decoded.user.role === 'student') {
         const student = await StudentClientService.getStudentData(decoded.user.id);
         socket.connectedUserId = student._id;
         socket.connectedUserRole = 'student';
      } else if (decoded.user.role === 'instructor') {
         const instructor = await InstructorClientService.getInstructorData(decoded.user.id);
         socket.connectedUserId = instructor._id;
         socket.connectedUserRole = 'instructor';
      }

      socket.mainUserID = decoded.user.id;
      next();

   } catch (err) {
      next(err);
   }
};