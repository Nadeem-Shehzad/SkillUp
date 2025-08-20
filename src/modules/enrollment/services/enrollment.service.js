import mongoose from "mongoose";
import ApiError from "../../../utils/apiError.js";
import { constants } from "../../../constants/statusCodes.js";
import { Course } from "../../course/models/course.model.js";
import { Student } from "../../student/index.js";
import { Enrollment } from "../models/enrollment.model.js";
import {
   newEnrollmentsThisMonth,
   overallStats,
   topCoursesByEnrollment,
   topInstructorsByEnrollment
} from "../pipelines/pipelines.enrollment.js";



export const topEnrollmentCoursesService = async () => {

   const enrolledStudents = await Enrollment.aggregate([
      {
         $group: {
            _id: '$courseId',
            totalStudents: { $sum: 1 }
         }
      },
      { $sort: { totalStudents: -1 } }
   ]);

   return enrolledStudents;
}


export const courseEnrollmentService = async ({ userId, courseId }) => {
   if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(courseId)) {
      throw new ApiError(constants.VALIDATION_ERROR, 'Invalid Course or Student ID!');
   }

   const student = await Student.findOne({ user: userId });
   if (!student) {
      throw new ApiError(constants.NOT_FOUND, 'Student not Found!');
   }

   const course = await Course.findById(courseId);
   if (!course) {
      throw new ApiError(constants.NOT_FOUND, 'Course to enroll not Found!');
   }

   const enrolledCourse = await Enrollment.create({
      studentId: student._id,
      courseId
   });

   student.enrolledCourses.push(courseId);
   await student.save();

   return enrolledCourse;
}


export const getEnrolledCoursesService = async ({ studentId }) => {
   if (!mongoose.Types.ObjectId.isValid(studentId)) {
      throw new ApiError(constants.VALIDATION_ERROR, 'Invalid Student ID!');
   }

   const enrolledCourses = await Enrollment.find({ studentId });

   return enrolledCourses;
}


export const getEnrolledCourseDetailsService = async ({ enrollId }) => {
   if (!mongoose.Types.ObjectId.isValid(enrollId)) {
      throw new ApiError(constants.VALIDATION_ERROR, 'Invalid enrollId!');
   }

   const enrollmentDetail = await Enrollment.findById(enrollId)
      .populate({
         path: 'courseId',
         select: 'title description category level totalLectures averageRating instructor',
         populate: {
            path: 'instructor',
            select: 'user',
            populate: {
               path: 'user',
               select: 'name email'
            }
         }
      });

   if (!enrollmentDetail) {
      throw new ApiError(constants.NOT_FOUND, 'No Enrollment Exists!');
   }

   return enrollmentDetail;
}


export const getEnrolledStudentsService = async ({ courseId, instructorId }) => {

   if (!mongoose.Types.ObjectId.isValid(instructorId) || !mongoose.Types.ObjectId.isValid(courseId)) {
      throw new ApiError(constants.VALIDATION_ERROR, 'Invalid course or Instructor ID!');
   }

   const course = await Course.findById(courseId).populate({
      path: 'instructor',
      populate: {
         path: 'user',
         select: '_id'
      }
   });

   if (!course) {
      throw new ApiError(constants.NOT_FOUND, 'Course not Found!');
   }

   if (!course.instructor || !course.instructor.user) {
      throw new ApiError(constants.NOT_FOUND, 'Instructor not found for this course!');
   }

   if (course.instructor.user._id.toString() !== instructorId.toString()) {
      throw new ApiError(constants.FORBIDDEN, 'Not allowed to see enrollments of another instructor\'s course!');
   }

   const enrolledStudents = await Enrollment.find({ courseId })
      .select('-courseId -__v -createdAt -updatedAt')
      .populate({
         path: 'studentId',
         select: 'user -_id',
         populate: {
            path: 'user',
            select: 'name email -_id'
         }
      });

   return enrolledStudents || [];
}


export const admin_studentEnrollmentsService = async ({ studentId }) => {

   if (!mongoose.Types.ObjectId.isValid(studentId)) {
      throw new ApiError(constants.VALIDATION_ERROR, 'Invalid Student ID!');
   }

   const enrollments = await Enrollment.find({ studentId })
      .select('-__v -createdAt -updatedAt')
      .populate({
         path: 'courseId',
         select: 'title description category level price discount averageRating'
      });

   return enrollments || [];
}


export const admin_courseEnrollmentsService = async ({ courseId }) => {

   if (!mongoose.Types.ObjectId.isValid(courseId)) {
      throw new ApiError(constants.VALIDATION_ERROR, 'Invalid courseId!');
   }

   const enrollments = await Enrollment.find({ courseId })
      .select('-courseId -__v -createdAt -updatedAt')
      .populate({
         path: 'studentId',
         select: 'user -_id',
         populate: {
            path: 'user',
            select: 'name email -_id'
         }
      });

   return enrollments || [];

}


export const admin_updateEnrollmentService = async ({ enrollmentId, dataToUpdate }) => {

   if (!mongoose.Types.ObjectId.isValid(enrollmentId)) {
      throw new ApiError(constants.VALIDATION_ERROR, 'Invalid enrollmentId!');
   }

   const updated_enrollment = await Enrollment.findByIdAndUpdate(
      enrollmentId,
      dataToUpdate,
      { new: true }
   );

   return updated_enrollment;
}


export const admin_deleteEnrollmentService = async ({ enrollmentId }) => {

   if (!mongoose.Types.ObjectId.isValid(enrollmentId)) {
      throw new ApiError(constants.VALIDATION_ERROR, 'Invalid enrollmentId!');
   }

   const delete_enrollment = await Enrollment.findByIdAndDelete(enrollmentId);

   return delete_enrollment;
}


export const admin_allStatsService = async () => {

   const stats = await Enrollment.aggregate([
      {
         $facet: {
            overallStats: overallStats,
            topCoursesByEnrollment: topCoursesByEnrollment,
            topInstructorsByEnrollment: topInstructorsByEnrollment,
            thisMonthEnrollments: newEnrollmentsThisMonth
         }
      }
   ]);

   return stats;
}