import mongoose from "mongoose";
import axios from "axios";

import { ApiError, constants } from "@skillup/common-utils";

const ENROLLMENT_SERVICE_URL = "http://localhost:5000";
const INSTRUCTOR_SERVICE_URL = "http://localhost:5000";
const COURSE_SERVICE_URL = "http://localhost:5000";



export const checkEnrollment = async (req, res, next) => {
   try {
      const studentId = req.user.id;
      const courseId = req.params.courseId;

      const { data: enroll } = await axios.post(`${ENROLLMENT_SERVICE_URL}/api/v1/public/enrollments/check-enrollment/${courseId}`, { studentId, courseId });

      if (!enroll) {
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

      const { data: instructor } = await axios.get(`${INSTRUCTOR_SERVICE_URL}/api/v1/public/instructors/check/${instructorId}`);
      if (!instructor) {
         throw new ApiError(constants.NOT_FOUND, 'Instructor not Found!');
      }

      req.user.id = instructor._id;
      next();

   } catch (error) {
      next(error);
   }
}


export const checkReviewedInstructor = async (req, res, next) => {
   try {
      const instructorId = req.params.instructorId;
      if (!mongoose.Types.ObjectId.isValid(instructorId)) {
         throw new ApiError(constants.VALIDATION_ERROR, 'Invalid Instructor ID!');
      }

      const { data: instructor } = await axios.get(`${INSTRUCTOR_SERVICE_URL}/api/v1/public/instructors/check/${instructorId}`);
      if (!instructor) {
         throw new ApiError(constants.NOT_FOUND, 'Instructor not Found!');
      }

      next();

   } catch (error) {
      next(error);
   }
}


export const enrolledWithInstructor = async (req, res, next) => {
   try {
      const studentId = req.user.id;
      const instructorId = req.params.instructorId;

      const { data: studentExists } = await axios.post(`${INSTRUCTOR_SERVICE_URL}/api/v1/public/students/check-enrollment`, { studentId, instructorId });
      if (!studentExists) {
         throw new ApiError(constants.FORBIDDEN, 'Sorry, you are not enrolled in any course of this instructor!');
      }

      next();

   } catch (error) {
      next(error);
   }
}


export const checkCourseOwner = async (req, res, next) => {
   try {
      const instructorId = req.user.id;
      const courseId = req.params.courseId;

      const { data } = await axios.get(`${COURSE_SERVICE_URL}/api/v1/public/courses/summary/${courseId}`);
      const { courseName, instructor } = data;  
      if (instructorId.toString() !== instructor._id.toString()) {
         throw new ApiError(constants.FORBIDDEN, `Access Denied: can't see other's course reviews!`);
      }

      req.courseId = courseId;
      next();

   } catch (error) {
      next(error);
   }
}