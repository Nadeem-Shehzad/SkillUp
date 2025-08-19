
import {
   admin_allStatsService,
   admin_courseEnrollmentsService,
   admin_deleteEnrollmentService,
   admin_studentEnrollmentsService,
   admin_updateEnrollmentService,
   courseEnrollmentService,
   getEnrolledCourseDetailsService,
   getEnrolledCoursesService,
   getEnrolledStudentsService,
   topEnrollmentCoursesService,
} from "../services/enrollment.services.js";


// public
export const topEnrollmentCourses = async (req, res, next) => {
   try {

      const enrolledStudents = await topEnrollmentCoursesService();

      return res.status(201).json({ success: true, message: 'Enrolled Students.', data: enrolledStudents });
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


// admin 
export const admin_studentEnrollments = async (req, res, next) => {
   try {
      const studentId = req.params.studentId;
      const student_Enrollments = await admin_studentEnrollmentsService({ studentId });

      return res.status(200).json({ success: true, message: 'Student Enrollments.', data: student_Enrollments });
   } catch (error) {
      next(error);
   }
}


export const admin_courseEnrollments = async (req, res, next) => {
   try {
      const courseId = req.params.courseId;
      const course_Enrollments = await admin_courseEnrollmentsService({ courseId });

      return res.status(200).json({ success: true, message: 'Course Enrollments.', data: course_Enrollments });
   } catch (error) {
      next(error);
   }
}


export const admin_updateEnrollment = async (req, res, next) => {
   try {
      const enrollmentId = req.params.id;
      const dataToUpdate = req.body;
      const enrollments = await admin_updateEnrollmentService({ enrollmentId, dataToUpdate });

      return res.status(200).json({ success: true, message: 'Updatd Enrollment Data.', data: enrollments });
   } catch (error) {
      next(error);
   }
}


export const admin_deleteEnrollment = async (req, res, next) => {
   try {
      const enrollmentId = req.params.id;
      const enrollments = await admin_deleteEnrollmentService({ enrollmentId });

      return res.status(200).json({ success: true, message: 'Enrollment Deleted.', data: enrollments });
   } catch (error) {
      next(error);
   }
}


export const admin_allStats = async (req, res, next) => {
   try {
      const enrollments = await admin_allStatsService();

      return res.status(200).json({ success: true, message: 'All Stats.', data: enrollments });
   } catch (error) {
      next(error);
   }
}