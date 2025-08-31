import mongoose from "mongoose";
import { logger } from "@skillup/common-utils";

import { EnrollmentClientService } from "../services/client/enrollmentClient.service.js";
import { CourseClientService } from "../services/client/courseClient.service.js";
import { checkUndeliveredMessages } from "../services/groupChat.service.js";
import { GroupChatMessage } from "../model/chatGroup.model.js";


export const setupGroupChatSocket = (io, socket) => {
   (async () => {
      try {
         const mainUserID = socket.mainUserID;
         const userId = socket.connectedUserId;
         const role = socket.connectedUserRole;

         let courseIds = [];

         if (role === "student") {
            const enrolled = await EnrollmentClientService.getAllEnrollments({ studentId: userId });
            courseIds = enrolled.map(e => e.courseId);
         }

         if (role === "instructor") {
            const courses = await CourseClientService.getInstructorCoursesIds(userId);
            courseIds = courses;
         }

         courseIds.forEach(courseId => socket.join(`course_${courseId}`));

         await checkUndeliveredMessages(courseIds, mainUserID);

         socket.emit("joinedCourses", courseIds);

      } catch (error) {
         logger.error("Error joining courses:", error.message);
         socket.emit("error", { message: "Failed to join courses" });
      }
   })();

   socket.on('openCourseChat', async ({ courseId }) => {
      socket.currentChat = courseId;
      logger.warn(`User ${socket.mainUserID} is now viewing course ${courseId}`);

      const socketMainUserID = new mongoose.Types.ObjectId(socket.mainUserID);

      await GroupChatMessage.updateMany(
         {
            courseId,
            readBy: { $ne: socketMainUserID },
            senderId: { $ne: socketMainUserID },
         },
         {
            $addToSet: {
               readBy: socketMainUserID,
               deliveredTo: socketMainUserID
            }
         }
      );
   });

   socket.on('closeCourseChat', () => {
      logger.error(`User ${socket.mainUserID} left course ${socket.currentChat}`);
      socket.currentChat = null;
   });
};