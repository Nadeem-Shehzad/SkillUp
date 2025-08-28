import { constants, logger } from "@skillup/common-utils";
import { CourseClientService } from "../services/client/courseClient.service.js";
import { InstructorClientService } from "../services/client/instructorClient.service.js";
import { StudentClientService } from "../services/client/studentClient.service.js";
import { EnrollmentClientService } from "../services/client/enrollmentClient.service.js";



export const checkCourseExists = async (req, res, next) => {
   try {
      const courseId = req.params.courseId;
      const course = await CourseClientService.findCourse(courseId);
      if (!course) {
         throw new Error(constants.NOT_FOUND, 'Course not Found!');
      }

      req.courseId = courseId;
      next();
   } catch (error) {
      next(error);
   }
}


export const checkInstructorExists = async (req, res, next) => {
   try {
      const instructorId = req.params.instructorId;
      const instructor = await InstructorClientService.getInstructorData({ instructorId });
      if (!instructor) {
         throw new Error(constants.NOT_FOUND, 'Instructor not Found!');
      }

      req.instructorId = instructor._id;
      next();
   } catch (error) {
      next(error);
   }
}


export const checkStudentExists = async (req, res, next) => {
   try {
      const studentId = req.params.studentId;
      const student = await StudentClientService.findOneStudent({ studentId });
      if (!student) {
         throw new Error(constants.NOT_FOUND, 'Student not Found!');
      }

      req.studentId = student._id;
      next();
   } catch (error) {
      next(error);
   }
}


export const checkEnrollmentExists = async (req, res, next) => {
   try {
      const enrollmentId = req.params.enrollmentId;
      const enrollment = await EnrollmentClientService.findEnrollment({ enrollmentId });
      if (!enrollment) {
         throw new Error(constants.NOT_FOUND, 'Enrollment not Found!');
      }

      req.enrollmentId = enrollment._id;
      next();
   } catch (error) {
      next(error);
   }
}