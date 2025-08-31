import { InstructorPublicService } from "../../../instructor/index.js";


export const InstructorClientService = {
   getInstructorData(userId) {
      return InstructorPublicService.getInstructorUserData(userId);
   }
}