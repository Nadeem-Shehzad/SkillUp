import { Enrollment } from "../models/enrollment.model.js";


export const EnrollmentPublicService = {

   async checkEnrollment(studentId, courseId) {
      const enrollment = await Enrollment.findOne({
         studentId,
         courseId
      });
      return !!enrollment;
   },

};