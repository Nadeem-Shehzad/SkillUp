import { ApiError, constants } from "@skillup/common-utils";
import mongoose from "mongoose";
import { StudentClientService } from "../services/client/studentClient.service.js";
import { CourseClientService } from "../services/client/courseClient.service.js";



export const checkStudentExists = async (req, res, next) => {
   try {
      const studentId = req.user.id;
      if (!mongoose.Types.ObjectId.isValid(studentId)) {
         throw new ApiError(constants.VALIDATION_ERROR, 'Invalid StudentID!');
      }

      const student = await StudentClientService.getStudent({ studentId });
      if (!student) {
         throw new ApiError(constants.NOT_FOUND, 'Student not Found!');
      }

      req.studentId = student._id;
      next();
   } catch (error) {
      next(error);
   }
}


export const checkCourseExists = async (req, res, next) => {
   try {
      const courseId = req.body.courseId;
      if (!mongoose.Types.ObjectId.isValid(courseId)) {
         throw new ApiError(constants.VALIDATION_ERROR, 'Invalid courseId!');
      }

      const course = await CourseClientService.checkCourse({ courseId });
      if (!course) {
         throw new ApiError(constants.NOT_FOUND, 'Course not Found!');
      }

      req.courseId = course._id;
      next();
   } catch (error) {
      next(error);
   }
}