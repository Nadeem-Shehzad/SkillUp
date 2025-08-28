import { StudentPublicService } from "../../../student/index.js";


export const StudentClientService = {
   getStudents({ page, limit }) {
      return StudentPublicService.allStudents({ page, limit });
   },

   findOneStudent({ studentId }) {
      return StudentPublicService.findStudent({ studentId });
   },

   updateStudentStatus({ studentId, isblocked }) {
      return StudentPublicService.updateStudentStatus({ studentId, isblocked });
   }
}