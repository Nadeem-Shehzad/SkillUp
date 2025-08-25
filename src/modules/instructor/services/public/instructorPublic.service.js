import { Instructor } from "../../models/instructor.model.js";
import { AuthClientService } from "../client/authClient.service.js";


export const InstructorPublicService = {

   createInstructor(userId) {
      return Instructor.create({ user: userId });
   },

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

   checkInstructorExists(instructorId) {
      return Instructor.findOne({ user: instructorId });
   },

   getAllInstructors({ page, limit }) {
      return Instructor.find({})
         .populate('user', 'name email isVerified')
         .skip((page - 1) * limit).limit(limit);
   }
}