import { CoursePublicService } from "../../../course/index.js";


export const CourseClientService = {
   checkCourse({ courseId }) {
      return CoursePublicService.findCourse({ courseId });
   }
}