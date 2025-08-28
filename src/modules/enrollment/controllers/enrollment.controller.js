
import {
   admin_allStatsService,
   courseEnrollmentService,
   getEnrolledCourseDetailsService,
   getEnrolledCoursesService,
   getEnrolledStudentsService,
   getInstructorAllCoursesAndEnrollmentsService,
   topEnrollmentCoursesService,
} from "../services/enrollment.service.js";


// public
export const topEnrollmentCourses = async (req, res, next) => {
   try {

      const enrolledStudents = await topEnrollmentCoursesService();

      return res.status(201).json({ success: true, message: 'Enrolled Students.', data: enrolledStudents });
   } catch (error) {
      next(error);
   }
}


export const getInstructorAllCoursesAndEnrollments = async (req, res, next) => {
   try {

      const instructorId = req.params.instructorId;
      const instructorCoursesAndEnrollments = await getInstructorAllCoursesAndEnrollmentsService(instructorId);

      return res.status(201).json({ success: true, message: 'Instructor Courses and Enrollment Data.', data: instructorCoursesAndEnrollments });
   } catch (error) {
      next(error);
   }
}




// student
export const courseEnrollment = async (req, res, next) => {
   try {
      const userId = req.user.id;
      const courseId = req.params.courseId;

      const enrolledCourse = await courseEnrollmentService({ userId, courseId });

      return res.status(201).json({ success: true, message: 'Course enrolled.', data: enrolledCourse });
   } catch (error) {
      next(error);
   }
}


export const enrolledCourses = async (req, res, next) => {
   try {
      const studentId = req.user.id;

      const enrolledCourses = await getEnrolledCoursesService({ studentId });

      return res.status(200).json({ success: true, message: 'Enrolled Courses.', data: enrolledCourses });
   } catch (error) {
      next(error);
   }
}


export const enrolledCourseDetails = async (req, res, next) => {
   try {
      const enrollId = req.params.enrollId;
      const enrollmentDetail = await getEnrolledCourseDetailsService({ enrollId });

      return res.status(200).json({ success: true, message: 'Enrollment Details.', data: enrollmentDetail });
   } catch (error) {
      next(error);
   }
}


// instructor
export const enrolledStudents = async (req, res, next) => {
   try {
      const courseId = req.params.courseId;
      const instructorId = req.user.id;
      const enrolledStudents = await getEnrolledStudentsService({ courseId, instructorId });

      return res.status(200).json({ success: true, message: 'Enrolled Students.', data: enrolledStudents });
   } catch (error) {
      next(error);
   }
}
