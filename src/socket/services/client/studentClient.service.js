import { StudentPublicService } from "../../../modules/student/index.js";


export const StudentClientService = {
   getStudentData(userId){
      return StudentPublicService.studentExists(userId);
   }
}