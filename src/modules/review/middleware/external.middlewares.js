import mongoose from "mongoose";

import { constants } from "../../../constants/statusCodes.js";
import ApiError from "../../../utils/apiError.js";
import { CourseClientService } from "../services/courseClient.service.js";
import { EnrollmentClientService } from "../services/enrollmentClient.service.js";
import { StudentClientService } from "../services/studentClient.service.js";


export const checkStudentExits = async (req, res, next) => {
   try {
      const studentId = req.user.id;
      if (!mongoose.Types.ObjectId.isValid(studentId)) {
         throw new ApiError(constants.VALIDATION_ERROR, 'Invalid Student ID!');
      }

      const student = await StudentClientService.checkStudentExists(studentId);
      if (!student) {
         throw new ApiError(constants.NOT_FOUND, 'Student not Found!');
      }

      req.user.id = student._id;
      next();

   } catch (error) {
      next(error);
   }
}


export const checkCourseExits = async (req, res, next) => {
   try {
      const courseId = req.params.courseId;

      if (!mongoose.Types.ObjectId.isValid(courseId)) {
         throw new ApiError(constants.VALIDATION_ERROR, 'Invalid Course ID!');
      }

      const exists = await CourseClientService.courseExists(courseId);
      if (!exists) {
         throw new ApiError(constants.NOT_FOUND, 'Course not Found!');
      }

      req.courseId = courseId;
      next();

   } catch (error) {
      next(error);
   }
}


export const checkEnrollment = async (req, res, next) => {
   try {
      const studentId = req.user.id;
      const courseId = req.params.courseId;

      if (!mongoose.Types.ObjectId.isValid(studentId) || !mongoose.Types.ObjectId.isValid(courseId)) {
         throw new ApiError(constants.VALIDATION_ERROR, 'Invalid Student or Course ID!');
      }
   
      const exists = await EnrollmentClientService.checkEnrollment(studentId, courseId);
      if (!exists) {
         throw new ApiError(constants.NOT_FOUND, 'To leave a review, first enroll in this course!');
      }
   
      next();

   } catch (error) {
      next(error);
   }
}