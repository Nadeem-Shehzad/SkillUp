import { InstructorPublicService } from "../../instructor/index.js";


export const InstructorClientService = {
   createInstructor(userId) {
      return InstructorPublicService.createInstructor(userId);
   }
}