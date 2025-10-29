import axios from "axios";
import { ApiError, constants, logger } from "../index.js";

const COURSE_SERVICE_URL = "http://localhost:5000"; // example

export const CourseClientService = {
   async getCourseSummary(courseId) {
      try {
         const { data } = await axios.get(`${COURSE_SERVICE_URL}/api/v1/public/courses/summary/${courseId}`);
         const { courseName, instructor } = data;

         return { courseName, instructor };
      } catch (err) {
         console.error("Error fetching course summary:", err.message);
         throw new ApiError(constants.INTERNAL_SERVER_ERROR, "Failed to fetch course summary");
      }
   },

   async updateCourseRating(courseId, avgRating, totalReviews) {
      try {
         await axios.put(`${COURSE_SERVICE_URL}/api/v1/public/courses/rating/${courseId}`, {
            avgRating,
            totalReviews,
         });
      } catch (err) {
         console.error("Error updating course rating:", err.message);
         throw new ApiError(constants.INTERNAL_SERVER_ERROR, "Failed to update course rating");
      }
   },

};
