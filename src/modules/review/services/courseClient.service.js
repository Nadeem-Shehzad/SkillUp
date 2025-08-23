
import { CoursePublicService } from "../../course/index.js";


export const CourseClientService = {

   courseExists(courseId) {
      return CoursePublicService.courseExists(courseId);
   },

   updateCourseRating(courseId, avgRating, totalReviews) {
      return CoursePublicService.updateCourseRating(courseId, avgRating, totalReviews);
   },

   getCourseSummary(courseId) {
      return CoursePublicService.getCourseSummary(courseId);
   }
}