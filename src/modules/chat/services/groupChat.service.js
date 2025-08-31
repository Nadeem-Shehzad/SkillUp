import mongoose from "mongoose";
import { ApiError, constants, logger } from "@skillup/common-utils";
import { GroupChatMessage } from "../model/chatGroup.model.js";
import { SocketClientService } from "../services/client/socketClient.service.js";
import { EnrollmentClientService } from "./client/enrollmentClient.service.js";
import { CourseClientService } from "./client/courseClient.service.js";
import { StudentClientService } from "./client/studentClient.service.js";
import { InstructorClientService } from "./client/instructorClient.service.js";



export const getMyGroupsService = async ({ userId, role }) => {
   const mainUserID = new mongoose.Types.ObjectId(userId);
   let courseIds = [];

   if (role === "student") {
      const student = await StudentClientService.getStudentData(userId);
      if (!student) {
         throw new ApiError(constants.NOT_FOUND, 'Student Not Found!');
      }
      userId = student._id;

      const enrolled = await EnrollmentClientService.getAllEnrollments({ studentId: userId });
      courseIds = enrolled.map(e => e.courseId);
   }

   if (role === "instructor") {
      const instructor = await InstructorClientService.getInstructorData(userId);
      if (!instructor) {
         throw new ApiError(constants.NOT_FOUND, 'Instructor Not Found!');
      }

      userId = instructor._id;
      const courses = await CourseClientService.getInstructorCoursesIds(userId);
      courseIds = courses;
   }

   const groupsAndMessages = await GroupChatMessage.aggregate([
      { $match: { courseId: { $in: courseIds } } },
      { $sort: { createdAt: -1 } },
      {
         $group: {
            _id: '$courseId',
            lastMessage: { $first: '$message' },
            createdAt: { $first: '$createdAt' },
            senderId: { $first: '$senderId' },
            senderName: { $first: '$senderName' },
            courseId: { $first: '$courseId' },
            courseName: { $first: '$courseName' },
            message: { $first: '$message' },
            unreadCount: {
               $sum: {
                  $cond: [
                     {
                        $and: [
                           { $ne: ['$senderId', mainUserID] },
                           { $not: [{ $in: [mainUserID, '$readBy'] }] }
                        ]
                     },
                     1,
                     0
                  ]
               }
            }
         }
      },
      { $sort: { createdAt: -1 } },
      {
         $project: {
            message: 1,
            createdAt: 1,
            senderName: 1,
            courseId: 1,
            courseName: 1,
            unreadCount: 1
         }
      }
   ]);

   return groupsAndMessages;
}


export const sendGroupMessageService = async ({ courseId, courseName, senderId, senderName, role, message }) => {
   const io = SocketClientService.getIOSocketInstance();

   const messageData = await GroupChatMessage.create({
      courseId,
      courseName,
      senderId,
      senderName,
      role,
      message,
   });

   const usersSocketMap = SocketClientService.getUsersSocketMap();
   const userSocketId = usersSocketMap.get(senderId.toString());
   if (!userSocketId) {
      throw new ApiError(constants.NOT_FOUND, 'User SocketId not Found!');
   }

   io.to(`course_${courseId}`).except(userSocketId).emit("broadcastCourseMessage", messageData);

   const clients = await io.in(`course_${courseId}`).fetchSockets();

   const connectedUserIds = clients
      .map(c => c.mainUserID)
      .filter(id => id && id.toString() !== senderId.toString());

   if (connectedUserIds.length > 0) {
      await GroupChatMessage.updateOne(
         { _id: messageData._id },
         { $addToSet: { deliveredTo: { $each: connectedUserIds } } }
      );
   }

   return messageData;
}


export const getGroupMessagesService = async ({ courseId }) => {
   const groupMessages = await GroupChatMessage.find({ courseId });
   return groupMessages;
}


export const delGroupMessageService = async ({ messageId }) => {
   const delMessage = await GroupChatMessage.findByIdAndDelete(messageId);
   return delMessage;
}


export const checkUndeliveredMessages = async (courseIds, userId) => {
   const userObjectId = new mongoose.Types.ObjectId(userId);
   for (const courseId of courseIds) {
      await GroupChatMessage.updateMany(
         {
            courseId,
            senderId: { $ne: userObjectId },
            deliveredTo: { $ne: userObjectId }
         },
         {
            $push: { deliveredTo: userObjectId }
         }
      );
   }
}