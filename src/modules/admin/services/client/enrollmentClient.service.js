import { EnrollmentPublicService } from "../../../enrollment/index.js";


export const EnrollmentClientService = {
   getStudentEnrollments({ studentId }) {
      return EnrollmentPublicService.studentEnrollments({ studentId });
   },

   getCourseEnrollments({ courseId }) {
      return EnrollmentPublicService.courseEnrollments({ courseId });
   },

   findEnrollment({ enrollmentId }) {
      return EnrollmentPublicService.findEnrollment({ enrollmentId });
   },

   updateEnrollment({ enrollmentId, dataToUpdate }) {
      return EnrollmentPublicService.updateEnrollment({ enrollmentId, dataToUpdate });
   },

   deleteEnrollment({ enrollmentId }) {
      return EnrollmentPublicService.deleteEnrollment({ enrollmentId });
   },

   enrollmentAllStats() {
      return EnrollmentPublicService.enrollmentAllStats();
   },
}
