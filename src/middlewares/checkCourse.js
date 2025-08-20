import mongoose from "mongoose";
import { Course } from "../modules/course/index.js";
import ApiError from "../utils/apiError.js";
import { constants } from "../constants/statusCodes.js";

export const checkCourseExits = async (req, res, next) => {
   try {

      const courseId = req.params.courseId;
      if (!mongoose.Types.ObjectId.isValid(courseId)) {
         throw new ApiError(constants.VALIDATION_ERROR, 'Invalid CourseId!');
      }

      const course = await Course.findById(courseId);
      if (!course) {
         throw new ApiError(constants.NOT_FOUND, 'Course not Found!');
      }

      next();

   } catch (error) {
      next(error);
   }
}