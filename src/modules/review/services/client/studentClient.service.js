import { StudentPublicService } from "../../../student/index.js";


export const StudentClientService = {
   checkStudentExists(studentId) {
      const student = StudentPublicService.studentExists(studentId);
      return student;
   }
}