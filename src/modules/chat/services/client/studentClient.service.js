import { StudentPublicService } from "../../../student/index.js";


export const StudentClientService = {
   getStudentData(userId) {
      return StudentPublicService.studentExists(userId);
   },

   getStudentUserData(userId) {
      return StudentPublicService.getStudentUserData(userId);
   }
}