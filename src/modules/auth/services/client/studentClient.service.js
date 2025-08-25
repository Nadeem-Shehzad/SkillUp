
import { StudentPublicService } from "../../../student/index.js";

export const StudentClientService = {
   createStudent(userId) {
      return StudentPublicService.createStudent(userId);
   }
}