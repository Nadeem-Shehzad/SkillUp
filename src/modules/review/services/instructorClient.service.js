import { InstructorPublicService } from "../../instructor/index.js";


export const InstructorClientService = {
   async checkInstructorExists(instructorId){
      return InstructorPublicService.checkInstructorExists(instructorId);
   }
}