import { Enrollment } from "../../models/enrollment.model.js";
import { CourseClientService } from "../client/courseClient.service.js";
import {
   admin_allStatsService,
   courseEnrollmentsService,
   deleteEnrollmentService,
   studentEnrollmentsService,
   updateEnrollmentService
} from "../enrollment.service.js";



export const EnrollmentPublicService = {

   async checkEnrollment(studentId, courseId) {
      const enrollment = await Enrollment.findOne({
         studentId,
         courseId
      });
      return !!enrollment;
   },

   async enrolledWithInstructor(studentId, instrcutorId) {
      const enrollments = await Enrollment.find({ studentId, }).populate({
         path: 'courseId',
         select: 'instructor'
      });

      const instructorIds = enrollments.map(e => e.courseId?.instructor?.toString());
      const isEnrolledWithInstructor = instructorIds.includes(instrcutorId.toString());

      return isEnrolledWithInstructor;
   },

   getEnrollmentCountForCourses(coursesIds) {
      return Enrollment.countDocuments({ courseId: { $in: coursesIds } });
   },

   async getInstructorCoursesAndEnrollmentsStats(instrcutorId) {

      const coursesData = await CourseClientService.findInstructorCoursesIdsAndNames(instrcutorId);

      const result = await Promise.all(
         coursesData.map(async (course) => {
            const totalStudents = await Enrollment.countDocuments({ courseId: course._id });

            return {
               courseId: course._id,
               courseName: course.title,
               totalStudents
            }
         })
      );

      return result;
   },

   studentEnrollments({ studentId }) {
      return studentEnrollmentsService({ studentId });
   },

   courseEnrollments({ courseId }) {
      return courseEnrollmentsService({ courseId });
   },

   findEnrollment({ enrollmentId }) {
      return Enrollment.findById(enrollmentId);
   },

   updateEnrollment({ enrollmentId, dataToUpdate }) {
      return updateEnrollmentService({ enrollmentId, dataToUpdate });
   },

   deleteEnrollment({ enrollmentId }) {
      return deleteEnrollmentService({ enrollmentId });
   },

   enrollmentAllStats() {
      return admin_allStatsService();
   },

   findAllEnrollmentsOfStudent({ studentId }) {
      return Enrollment.find({ studentId }).select('courseId');
   }
};