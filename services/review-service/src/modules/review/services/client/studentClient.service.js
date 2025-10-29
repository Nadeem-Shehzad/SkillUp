import { StudentPublicService } from "../../../student/index.js";


export const StudentClientService = {
   async checkStudentExists(studentId) {
      const student = StudentPublicService.studentExists(studentId);
      return student;
   },

   async enrolledWithInstructor(studentId, instructorId) {
      return StudentPublicService.enrolledWithInstructor(studentId, instructorId);
   }
}