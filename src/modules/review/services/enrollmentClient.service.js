import { EnrollmentPublicService } from "../../enrollment/index.js";


export const EnrollmentClientService = {
   async checkEnrollment(studentId, courseId) {
      return EnrollmentPublicService.checkEnrollment(studentId, courseId);
   }
}