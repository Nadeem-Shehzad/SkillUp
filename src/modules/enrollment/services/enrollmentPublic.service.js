import { Enrollment } from "../models/enrollment.model.js";


export const EnrollmentPublicService = {

   checkEnrollment(studentId, courseId) {
      const enrollment = Enrollment.findOne({
         studentId,
         courseId
      });
      return !!enrollment;
   },

};