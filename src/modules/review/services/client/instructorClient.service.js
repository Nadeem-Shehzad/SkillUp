import { InstructorPublicService } from "../../../instructor/index.js";


export const InstructorClientService = {
   checkInstructorExists(instructorId){
      return InstructorPublicService.checkInstructorExists(instructorId);
   }
}