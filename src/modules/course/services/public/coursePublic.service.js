
import { logger } from "@skillup/common-utils";
import { Course } from "../../models/course.model.js";
import { InstructorClientService } from "../client/instructorClient.service.js";
import {
   allCourses,
   publish_CourseByAdmin,
   unpublish_CourseByAdmin
} from "../course.service.js";


export const CoursePublicService = {

   async courseExists(courseId) {
      const course = await Course.findById(courseId);
      return !!course;
   },

   findCourse({ courseId }) {
      return Course.findById(courseId);
   },

   findCourseInstructor({ courseId }) {
      return Course.findById(courseId).populate({
         path: 'instructor',
         populate: {
            path: 'user',
            select: '_id'
         }
      });
   },

   async updateCourseRating(courseId, avgRating, totalReviews) {
      return await Course.findByIdAndUpdate(courseId, {
         averageRating: avgRating,
         totalReviews
      }, { new: true });
   },

   async getCourseSummary(courseId) {
      const course = await Course.findById(courseId);

      const instructor = await InstructorClientService.getInstructorData(course.instructor);

      const courseName = course.title;

      return { courseName, instructor };
   },

   async getInstructorCourseIds(instrcutorId) {
      const courses = await Course.find({ instructor: instrcutorId });
      return courses.map((c) => c._id);
   },

   async getInstructorCourseIdsAndNames(instrcutorId) {
      return await Course.find({ instructor: instrcutorId }).select('_id title');
   },

   allCourse({ page, limit }) {
      return allCourses({ page, limit });
   },

   approveCourse({ courseId }) {
      return publish_CourseByAdmin({ courseId });
   },

   rejectCourse({ courseId, reason }) {
      return unpublish_CourseByAdmin({ courseId, reason });
   }
};