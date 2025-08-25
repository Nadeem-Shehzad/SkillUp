import { logger } from "@skillup/common-utils";
import { InstructorPublicService } from "../../../instructor/index.js";
import { EnrollmentPublicService } from "../public/enrollmentPublic.service.js";
import { CourseClientService } from "./courseClient.service.js";



export const InstructorClientService = {
   async updateInstructorEnrollmentStats(instrcutorId) {
      const coursesIds = await CourseClientService.findInstructorCoursesIds(instrcutorId);
      const enrollmentCount = await EnrollmentPublicService.getEnrollmentCountForCourses(coursesIds);

      await InstructorPublicService.updateInstructorStudentCounting(instrcutorId, enrollmentCount);
   },
}