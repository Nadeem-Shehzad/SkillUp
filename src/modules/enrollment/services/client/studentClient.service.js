import { Student, StudentPublicService } from "../../../student/index.js";


export const StudentClientService = {
   findOneStudent(studentId){
      return StudentPublicService.studentExists(studentId);
   }
}