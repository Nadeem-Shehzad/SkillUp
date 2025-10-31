import mongoose from "mongoose";
import ApiError from "../apiError.js";
import { constants } from "../statusCodes.js";
import axios from "axios";
import logger from "../logger.js";

const COURSE_SERVICE_URL = "http://localhost:5000";


export const checkCourseExits = async (req, res, next) => {
   try {
      const courseId = req.params.courseId;

      if (!mongoose.Types.ObjectId.isValid(courseId)) {
         throw new ApiError(constants.VALIDATION_ERROR, 'Invalid Course ID!');
      }

      const { data: course } = await axios.get(`${COURSE_SERVICE_URL}/api/v1/public/courses/exists/${courseId}`);
      if (!course) {
         throw new ApiError(constants.NOT_FOUND, 'Course not Found!');
      }

      logger.warn(`Course Found --> ${course}`);

      req.courseId = courseId;
      next();

   } catch (error) {
      next(error);
   }
}