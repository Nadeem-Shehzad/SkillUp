import { InstructorPublicService } from "../../../modules/instructor/index.js";


export const InstructorClientService = {
   getInstructorData(userId) {
      return InstructorPublicService.findInstructor(userId);
   }
}