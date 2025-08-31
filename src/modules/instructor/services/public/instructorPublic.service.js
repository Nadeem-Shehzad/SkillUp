import { Instructor } from "../../models/instructor.model.js";
import { AuthClientService } from "../client/authClient.service.js";


export const InstructorPublicService = {

   createInstructor(userId) {
      return Instructor.create({ user: userId });
   },

   async getInstructorData(instructorId) {
      const instructor = await Instructor.findById(instructorId)
         .select('_id user bio expertise qualifications totalCourses totalStudents averageRating status');

      const user = await AuthClientService.getUserInfo(instructor.user);

      const userObj = user.toObject();
      const instructorObj = instructor.toObject();

      const instructorData = {
         ...userObj,
         ...instructorObj
      }

      return instructorData;
   },

   async getInstructorUserData(instructorId) {
      const instructor = await Instructor.findOne({ user: instructorId })
         .select('_id user bio expertise qualifications totalCourses totalStudents averageRating status');

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
      return Instructor.findById(instructorId);
   },

   findInstructor(userId) {
      return Instructor.findOne({ user: userId });
   },

   getAllInstructors({ page, limit }) {
      return Instructor.find({})
         .populate('user', 'name email isVerified')
         .skip((page - 1) * limit).limit(limit);
   },

   updateInstructorRating(instrcutorId, avgRating) {
      return Instructor.findByIdAndUpdate(instrcutorId, {
         averageRating: avgRating
      });
   },

   updateInstructorCourseCounting(instrcutorId, totalCourses) {
      return Instructor.findByIdAndUpdate(instrcutorId, {
         totalCourses
      });
   },

   updateInstructorStudentCounting(instrcutorId, totalStudents) {
      return Instructor.findByIdAndUpdate(instrcutorId, {
         totalStudents
      }, { new: true });
   },

   updateInstructorStatus({ instructorId, status }) {
      return Instructor.findByIdAndUpdate(instructorId, {
         status
      }, { new: true });
   },
}