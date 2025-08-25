import { InstructorPublicService } from "../../../instructor/index.js";


export const InstructorClientService = {
   async getInstructorData(instructorId) {
      return await InstructorPublicService.getInstructorData(instructorId);
   },

   async getAllInstructorsData({ page, limit }) {
      return InstructorPublicService.getAllInstructors({ page, limit });
   },

   async updateCoursesCount(instrcutorId, totalCourses){
      return InstructorPublicService.updateInstructorCourseCounting(instrcutorId, totalCourses);
   }
}