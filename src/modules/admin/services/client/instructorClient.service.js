import { InstructorPublicService } from "../../../instructor/index.js";


export const InstructorClientService = {
   getAllInstructorsData({ page, limit }) {
      return InstructorPublicService.getAllInstructors({ page, limit });
   },

   getInstructorData({ instructorId }) {
      return InstructorPublicService.checkInstructorExists(instructorId);
   },

   updateInstructorStatus({ instructorId, status }) {
      return InstructorPublicService.updateInstructorStatus({ instructorId, status });
   }
}