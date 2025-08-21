
import { Course } from "../models/course.model.js";
import { InstructorClientService } from "./instructorClient.service.js";


export const CoursePublicService = {

   async courseExists(courseId) {
      const course = await Course.findById(courseId);
      return !!course;
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
   }

};