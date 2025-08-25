import { EnrollmentPublicService } from "../../../enrollment/index.js";

export const EnrollmentClientService = {
   enrolledWithInstructor(studentId,instructorId){
      return EnrollmentPublicService.enrolledWithInstructor(studentId,instructorId);
   }
}