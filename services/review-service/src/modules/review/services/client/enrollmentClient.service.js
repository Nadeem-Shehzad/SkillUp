import { EnrollmentPublicService } from "../../../enrollment/index.js";


export const EnrollmentClientService = {
   checkEnrollment(studentId, courseId) {
      return EnrollmentPublicService.checkEnrollment(studentId, courseId);
   }
}