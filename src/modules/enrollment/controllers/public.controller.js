import mongoose from "mongoose";
import { EnrollmentPublicService } from "../services/public/enrollmentPublic.service.js";
import { ApiError, constants, logger } from "@skillup/common-utils";


// public
export const checkEnrollment = async (req, res, next) => {
   try {

      const studentId = req.body.studentId;
      const courseId = req.body.courseId;

      if (!mongoose.Types.ObjectId.isValid(studentId) || !mongoose.Types.ObjectId.isValid(courseId)) {
         throw new ApiError(constants.VALIDATION_ERROR, 'Invalid Student or Course ID!');
      }

      const enrollment = await EnrollmentPublicService.checkEnrollment(studentId, courseId);

      logger.warn(`U r enrolled in this course --> ${enrollment}`);

      return res.status(200).json(enrollment);
   } catch (error) {
      next(error);
   }
}
