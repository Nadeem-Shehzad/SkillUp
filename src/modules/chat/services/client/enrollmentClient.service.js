import { EnrollmentPublicService } from "../../../enrollment/index.js";


export const EnrollmentClientService = {
   getAllEnrollments({ studentId }) {
      return EnrollmentPublicService.findAllEnrollmentsOfStudent({ studentId });
   },

   async checkEnrollments(studentId, courseId) {
      return EnrollmentPublicService.checkEnrollment(studentId, courseId);
   }
}