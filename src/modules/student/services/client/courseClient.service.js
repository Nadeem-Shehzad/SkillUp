import { CoursePublicService } from "../../../course/index.js";


export const CourseClientService = {
   findCourse(courseId){
      return CoursePublicService.findCourse({courseId});
   }
}