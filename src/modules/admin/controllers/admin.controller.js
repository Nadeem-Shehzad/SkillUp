import { logger } from "@skillup/common-utils";
import {
   assignAdminPermissionService,
   getAdminProfileService,
   verifyAdminService,
   publish_Course,
   unpublish_Course,
   getAllCourses,
   getCourse,
   getAllInstructorsDataService,
   getSingleInstructorDataService,
   updateInstructorStatusService,
   getAllStudentsDataService,
   getSingleStudentDataService,
   updateStudentStatusService,
   studentEnrollmentService,
   courseEnrollmentService,
   updateEnrollmentService,
   deleteEnrollmentService,
   enrollmentAllStatsService
} from "../services/admin.service.js";



export const getAdminProfile = async (req, res, next) => {
   try {
      const adminId = req.adminId;
      const admin = await getAdminProfileService({ adminId });

      res.status(200).json({ success: true, message: 'Admin Profile', data: admin })
   } catch (error) {
      next(error);
   }
}


export const assignAdminPermission = async (req, res, next) => {
   try {

      const adminId = req.params.adminId;
      const { permissions } = req.body;

      const admin = await assignAdminPermissionService({ adminId, permissions });

      res.status(200).json({ success: true, message: 'Role Assigned.', data: admin })
   } catch (error) {
      next(error);
   }
}


export const verifyAdminStatus = async (req, res, next) => {
   try {
      const adminId = req.params.adminId;
      const admin = await verifyAdminService({ adminId });
      res.status(200).json({ success: true, message: 'Admin Verified.', data: admin });
   } catch (error) {
      next(error);
   }
}


// courses 
export const getCourses = async (req, res, next) => {
   try {
      const { page, limit } = req.body;
      const courses = await getAllCourses({ page, limit });
      return res.status(200).json({ success: true, message: `All Courses.`, data: courses });
   } catch (error) {
      next(error);
   }
}


export const getSingleCourse = async (req, res, next) => {
   try {
      const courseId = req.params.courseId;
      const course = await getCourse({ courseId });
      return res.status(200).json({ success: true, message: `Course Details.`, data: course });
   } catch (error) {
      next(error);
   }
}


export const publishCourse = async (req, res, next) => {
   try {
      const courseId = req.params.courseId;
      const course = await publish_Course({ courseId });
      return res.status(200).json({ success: true, message: `Course Published By Admin.`, data: course });
   } catch (error) {
      next(error);
   }
}


export const unpublishCourse = async (req, res, next) => {
   try {
      const courseId = req.params.courseId;
      const { reason } = req.body;
      const course = await unpublish_Course({ courseId, reason });
      return res.status(200).json({ success: true, message: `Course unPublished By Admin.`, data: course });
   } catch (error) {
      next(error);
   }
}


export const courseEnrollments = async (req, res, next) => {
   try {
      const courseId = req.courseId;
      const course_Enrollments = await courseEnrollmentService({ courseId });

      return res.status(200).json({ success: true, message: 'Course Enrollments.', data: course_Enrollments });
   } catch (error) {
      next(error);
   }
}


export const coursesAllStats = async (req, res, next) => {
   try {
      //const coursesStats = await enrollmentAllStatsService();

      return res.status(200).json({ success: true, message: 'Courses All Stats.', data: null });
   } catch (error) {
      next(error);
   }
}



// instructors
export const getInstructors = async (req, res, next) => {
   try {
      const { page, limit } = req.body;
      const instructors = await getAllInstructorsDataService({ page, limit });
      return res.status(200).json({ success: true, message: `All Instructors.`, data: instructors });
   } catch (error) {
      next(error);
   }
}


export const getSingleInstructor = async (req, res, next) => {
   try {
      const instructorId = req.params.instructorId;
      const instructor = await getSingleInstructorDataService({ instructorId });
      return res.status(200).json({ success: true, message: `Instructor Detail.`, data: instructor });
   } catch (error) {
      next(error);
   }
}


export const updateInstructorStatus = async (req, res, next) => {
   try {
      const instructorId = req.instructorId;
      const { status } = req.body;
      const instructor = await updateInstructorStatusService({ instructorId, status });
      return res.status(200).json({ success: true, message: `Instructor Status changed to -' ${status} '- By Admin.`, data: instructor });
   } catch (error) {
      next(error);
   }
}



// students
export const getStudents = async (req, res, next) => {
   try {
      const { page, limit } = req.body;
      const students = await getAllStudentsDataService({ page, limit });
      return res.status(200).json({ success: true, message: `All Students.`, data: students });
   } catch (error) {
      next(error);
   }
}


export const getSingleStudent = async (req, res, next) => {
   try {
      const studentId = req.params.studentId;
      const student = await getSingleStudentDataService({ studentId });
      return res.status(200).json({ success: true, message: `Student Detail.`, data: student });
   } catch (error) {
      next(error);
   }
}


export const updateStudentStatus = async (req, res, next) => {
   try {
      const studentId = req.studentId;
      const { isblocked } = req.body;
      const student = await updateStudentStatusService({ studentId, isblocked });

      return res.status(200).json({
         success: true,
         message: `Student Status changed to block -' ${isblocked} '- By Admin.`,
         data: student
      });
   } catch (error) {
      next(error);
   }
}


export const studentEnrollments = async (req, res, next) => {
   try {
      const studentId = req.studentId;
      const student_Enrollments = await studentEnrollmentService({ studentId });

      return res.status(200).json({ success: true, message: 'Student Enrollments.', data: student_Enrollments });
   } catch (error) {
      next(error);
   }
}



// enrollments
export const updateEnrollment = async (req, res, next) => {
   try {
      const enrollmentId = req.enrollmentId;
      const dataToUpdate = req.body;
      const enrollments = await updateEnrollmentService({ enrollmentId, dataToUpdate });

      return res.status(200).json({
         success: true,
         message: 'Updatd Enrollment Data.',
         data: enrollments
      });
   } catch (error) {
      next(error);
   }
}


export const deleteEnrollment = async (req, res, next) => {
   try {
      const enrollmentId = req.enrollmentId;
      const enrollments = await deleteEnrollmentService({ enrollmentId });

      return res.status(200).json({ success: true, message: 'Enrollment Deleted.', data: enrollments });
   } catch (error) {
      next(error);
   }
}


export const enrollmentAllStats = async (req, res, next) => {
   try {
      const enrollments = await enrollmentAllStatsService();

      return res.status(200).json({ success: true, message: 'All Stats.', data: enrollments });
   } catch (error) {
      next(error);
   }
}