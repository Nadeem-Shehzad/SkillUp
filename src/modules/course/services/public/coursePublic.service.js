
import { Course } from "../../models/course.model.js";
import { InstructorClientService } from "../client/instructorClient.service.js";


export const CoursePublicService = {

   async courseExists(courseId) {
      const course = await Course.findById(courseId);
      return !!course;
   },

   findCourse({ courseId }) {
      return Course.findById(courseId);
   },

   findCourseInstructor({ courseId }) {
      return Course.findById(courseId).populate({
         path: 'instructor',
         populate: {
            path: 'user',
            select: '_id'
         }
      });
   },

   async updateCourseRating(courseId, avgRating, totalReviews) {
      return await Course.findByIdAndUpdate(courseId, {
         averageRating: avgRating,
         totalReviews
      });
   },

   async getCourseSummary(courseId) {
      const course = await Course.findById(courseId);
      const instructor = await InstructorClientService.getInstructorData(course.instructor);

      const courseName = course.title;

      return { courseName, instructor };
   },

   async getInstructorCourseIds(instrcutorId) {
      const courses = await Course.find({ instructor: instrcutorId });
      return courses.map((c) => c._id);
   },

   async getInstructorCourseIdsAndNames(instrcutorId) {
      return await Course.find({ instructor: instrcutorId }).select('_id title');
   }

};