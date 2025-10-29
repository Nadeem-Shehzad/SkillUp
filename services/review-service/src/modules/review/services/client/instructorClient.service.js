import { InstructorPublicService } from "../../../../../../../src/modules/instructor/index.js";


export const InstructorClientService = {
   checkInstructorExists(instructorId) {
      return InstructorPublicService.checkInstructorExists(instructorId);
   },

   updateInstructorRating(instructorId, avgRating) {
      return InstructorPublicService.updateInstructorRating(instructorId, avgRating);
   },

   getInstructorData(instructorId) {
      return InstructorPublicService.getInstructorData(instructorId);
   },
}