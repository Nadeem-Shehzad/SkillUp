import { Instructor } from "../models/instructor.model.js";
import { AuthClientService } from "./authClient.service.js";


export const InstructorPublicService = {

   async getInstructorData(instructorId) {
      const instructor = await Instructor.findById(instructorId)
         .select('user bio expertise qualifications totalCourses totalStudents averageRating status');

      const user = await AuthClientService.getUserInfo(instructor.user);

      const userObj = user.toObject();
      const instructorObj = instructor.toObject();

      const instructorData = {
         ...userObj,
         ...instructorObj
      }

      return instructorData;
   },

   async checkInstructorExists(instructorId) {
      const instructor = await Instructor.findOne({ user: instructorId });
      return instructor;
   }

}