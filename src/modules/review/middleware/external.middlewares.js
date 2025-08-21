import mongoose from "mongoose";

import { constants } from "../../../constants/statusCodes.js";
import ApiError from "../../../utils/apiError.js";
import { CourseClientService } from "../services/courseClient.service.js";
import { EnrollmentClientService } from "../services/enrollmentClient.service.js";
import { StudentClientService } from "../services/studentClient.service.js";
import { InstructorClientService } from "../services/instructorClient.service.js";


export const checkStudentExists = async (req, res, next) => {
   try {
      const studentId = req.user.id;
      if (!mongoose.Types.ObjectId.isValid(studentId)) {
         throw new ApiError(constants.VALIDATION_ERROR, 'Invalid Student ID!');
      }

      const student = await StudentClientService.checkStudentExists(studentId);
      if (!student) {
         throw new ApiError(constants.NOT_FOUND, 'Student not Found!');
      }

      req.userId = req.user.id;
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


export const checkInstructorExists = async (req, res, next) => {
   try {
      const instructorId = req.user.id;
      if (!mongoose.Types.ObjectId.isValid(instructorId)) {
         throw new ApiError(constants.VALIDATION_ERROR, 'Invalid Instructor ID!');
      }

      const instructor = await InstructorClientService.checkInstructorExists(instructorId);
      if (!instructor) {
         throw new ApiError(constants.NOT_FOUND, 'Instructor not Found!');
      }

      req.user.id = instructor._id;
      next();

   } catch (error) {
      next(error);
   }
}


export const checkCourseOwner = async (req, res, next) => {
   try {
      const instructorId = req.user.id;
      const courseId = req.params.courseId;

      const { instructor } = await CourseClientService.getCourseSummary(courseId);

      if (instructorId.toString() !== instructor._id.toString()) {
         throw new ApiError(constants.FORBIDDEN, `Access Denied: can't see other's course reviews!`);
      }

      req.courseId = courseId;
      next();

   } catch (error) {
      next(error);
   }
}