import { StudentPublicService } from "../../../student/index.js";


export const StudentClientService = {
   getStudent({ studentId }) {
      return StudentPublicService.studentExists(studentId);
   },

   getStudentUserData({ studentId }) {
      return StudentPublicService.findStudent({ studentId });
   }
}