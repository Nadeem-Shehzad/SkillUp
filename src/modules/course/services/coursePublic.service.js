import { Course } from "../models/course.model.js";


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
   }

};