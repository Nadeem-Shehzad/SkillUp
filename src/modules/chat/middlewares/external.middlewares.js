import { ApiError, constants, logger } from "@skillup/common-utils";
import { EnrollmentClientService } from "../services/client/enrollmentClient.service.js";
import { CourseClientService } from '../services/client/courseClient.service.js';
import { StudentClientService } from "../services/client/studentClient.service.js";
import { InstructorClientService } from "../services/client/instructorClient.service.js";
import { GroupChatMessage } from "../model/chatGroup.model.js";


export const checkUserAndEligibility = async (req, res, next) => {
   try {
      let userId = req.user.id;
      let role = req.user.role;
      const courseId = req.params.courseId;

      let allowed = false;
      let userName = '';
      let courseName = '';

      const course = await CourseClientService.checkCourse({ courseId });
      courseName = course.title;

      if (role === "student") {
         const student = await StudentClientService.getStudentUserData(userId);
         if (!student) {
            throw new ApiError(constants.NOT_FOUND, 'Student Not Found!');
         }

         userId = student._id;
         userName = student.name;

         allowed = await EnrollmentClientService.checkEnrollments(userId, courseId);

      } else if (role === "instructor") {
         const instructor = await InstructorClientService.getInstructorData(userId);
         if (!instructor) {
            throw new ApiError(constants.NOT_FOUND, 'Instructor Not Found!');
         }

         userId = instructor._id;
         userName = instructor.name;

         allowed = course && course.instructor.toString() === userId.toString();
      }

      if (!allowed) {
         throw new ApiError(constants.FORBIDDEN, 'Sorry, You are not the member of this group!')
      }

      req.userName = userName;
      req.userId = userId;
      req.role = role;
      req.courseId = courseId;
      req.courseName = courseName;

      next();

   } catch (error) {
      next(error);
   }
}


export const checkMessageOwner = async (req, res, next) => {
   try {
      let userId = req.userId;
      const { messageId } = req.body;
      let allowed = false;

      allowed = await GroupChatMessage.exists({ _id: messageId, userId });
      if (!allowed) {
         throw new ApiError(constants.FORBIDDEN, `Sorry, can't delete others message!`);
      }

      next();

   } catch (error) {
      next(error);
   }
}