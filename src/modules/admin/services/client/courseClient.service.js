import { CoursePublicService } from "../../../course/index.js";


export const CourseClientService = {
   findCourse(courseId) {
      return CoursePublicService.courseExists(courseId);
   },

   getAllCourses({ page, limit }) {
      return CoursePublicService.allCourse({ page, limit });
   },

   getCourse({ courseId }) {
      return CoursePublicService.findCourse({ courseId });
   },

   approveCourse({ courseId }) {
      return CoursePublicService.approveCourse({ courseId });
   },

   rejectCourse({ courseId, reason }) {
      return CoursePublicService.rejectCourse({ courseId, reason });
   },
}