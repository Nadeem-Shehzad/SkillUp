import { InstructorPublicService } from "../../instructor/index.js";


export const InstructorClientService = {
   async getInstructorData(instructorId) {
      return await InstructorPublicService.getInstructorData(instructorId);
   }
}