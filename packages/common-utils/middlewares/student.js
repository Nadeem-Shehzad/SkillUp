import mongoose from "mongoose";

import ApiError from "../apiError.js";
import { constants } from "../statusCodes.js";
import axios from "axios";
import logger from "../logger.js";

const STUDENT_SERVICE_URL = "http://localhost:5000";


export const checkStudentExists = async (req, res, next) => {
   try {
      const studentId = req.user.id;
      if (!mongoose.Types.ObjectId.isValid(studentId)) {
         throw new ApiError(constants.VALIDATION_ERROR, 'Invalid Student ID!');
      }

      logger.warn(`Inside CheckStudentExists Middlewares... ${studentId}`);

      const { data: student } = await axios.get(`${STUDENT_SERVICE_URL}/api/v1/public/students/exists/${studentId}`);
      if (!student) {
         throw new ApiError(constants.NOT_FOUND, 'Student not Found!');
      }

      req.userId = req.user.id;
      req.user.id = student._id;

      logger.warn(`Student Exists...`);

      next();

   } catch (error) {
      next(error);
   }
}