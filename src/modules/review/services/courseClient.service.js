
import { CoursePublicService } from "../../course/index.js";


export const CourseClientService = {

   async courseExists(courseId) {
      return CoursePublicService.courseExists(courseId);
   },

   async updateCourseRating(courseId, avgRating, totalReviews) {
      return CoursePublicService.updateCourseRating(courseId, avgRating, totalReviews);
   },

   async getCourseSummary(courseId) {
      return CoursePublicService.getCourseSummary(courseId);
   }
}