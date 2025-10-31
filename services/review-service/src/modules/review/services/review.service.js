import mongoose from "mongoose";
import axios from "axios";

import {
   ApiError,
   constants,
   CourseClientService,
   AuthClientService
} from "@skillup/common-utils";

import { Review } from "../models/courseReview.model.js";
import { InstructorReview } from "../models/instructorReview.model.js";

import {
   totalStats,
   ratingDistribution,
   latestReviews
} from "../pipelines/review.pipelines.js";

const INSTRUCTOR_SERVICE_URL = "http://localhost:5000";
const AUTH_SERVICE_URL = "http://localhost:5000";


//public 
export const getCourseReviewsService = async ({ courseId }) => {
   const reviews = await Review.find({ courseId });
   return reviews;
}


export const getCourseReviewsAnalyticsService = async ({ courseId }) => {

   const reviewsAnalytics = await Review.aggregate([

      { $match: { courseId: new mongoose.Types.ObjectId(courseId) } },

      {
         $facet: {
            totalStats: totalStats,
            ratingDistribution: ratingDistribution,
            latestReviews: latestReviews
         }
      }

   ]);

   return reviewsAnalytics;
}


export const getTopRatedCoursesService = async () => {

   const topRatedCourses = await Review.aggregate([
      {
         $group: {
            _id: { courseId: "$courseId", courseName: "$courseName", instructorName: "$instructorName" },
            avgRating: { $avg: "$rating" },
            totalReviews: { $sum: 1 }
         }
      },
      { $sort: { avgRating: -1, totalReviews: -1 } },
      { $limit: 10 },
      {
         $project: {
            _id: 0,
            courseId: "$_id.courseId",
            courseName: "$_id.courseName",
            instructorName: "$_id.instructorName",
            avgRating: { $round: ["$avgRating", 1] },
            totalReviews: 1
         }
      }
   ]);

   return topRatedCourses;
}



//student
export const addReviewService = async ({ studentId, studentAuthID, courseId, rating, comment }) => {

   const reviewExists = await Review.findOne({
      courseId,
      studentId
   });

   if (reviewExists) {
      throw new ApiError(constants.FORBIDDEN, "You already reviewed this course");
   }

   const { courseName, instructor } = await CourseClientService.getCourseSummary(courseId);

   const user = await AuthClientService.getUserInfo(studentId);

   const review = await Review.create({
      studentId,
      studentName: user.name,
      courseId,
      courseName,
      instructorName: instructor.name,
      rating,
      comment
   });

   const reviews = await Review.find({ courseId });
   const avgRating = parseFloat(reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1);

   await CourseClientService.updateCourseRating(courseId, avgRating, reviews.length);

   return review;
}


export const updateReviewService = async ({ reviewId, courseId, dataToUpdate }) => {

   const updatedReview = await Review.findByIdAndUpdate(
      reviewId,
      dataToUpdate,
      { new: true }
   );

   if (!updatedReview) {
      throw new ApiError(constants.NOT_FOUND, "Review not updated!");
   }

   const reviews = await Review.find({ courseId });
   const avgRating = parseFloat(reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1);

   await CourseClientService.updateCourseRating(courseId, avgRating, reviews.length);

   return updatedReview;
}


// for student/admin
export const deleteReviewService = async ({ reviewId, courseId }) => {

   const deletedReview = await Review.findByIdAndDelete(reviewId);

   const reviews = await Review.find({ courseId });
   const avgRating = parseFloat(reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1);

   await CourseClientService.updateCourseRating(courseId, avgRating, reviews.length);
}


export const getMyReviewsService = async ({ studentId }) => {

   const reviews = await Review.find({ studentId });

   return reviews;
}


export const addInstructorReviewService = async ({ studentId, studentAuthID, instructorId, rating, comment }) => {

   const reviewExists = await InstructorReview.findOne({
      instructorId,
      studentId
   });

   if (reviewExists) {
      throw new ApiError(constants.CONFLICT, "Sorry, You already reviewed this Instructor!");
   }

   const { data: instructor } = await axios.get(`${INSTRUCTOR_SERVICE_URL}/api/v1/public/instructors/${instructorId}`);
   const { data: user } = await axios.get(`${AUTH_SERVICE_URL}/api/v1/public/auth/user/${studentAuthID}`);

   const review = await InstructorReview.create({
      studentId,
      studentName: user.name,
      instructorId,
      instructorName: instructor.name,
      rating,
      comment
   });

   const reviews = await InstructorReview.find({ instructorId });
   const avgRating = parseFloat(reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1);

   await axios.put(`${INSTRUCTOR_SERVICE_URL}/api/v1/public/instructors/${instructorId}`, { avgRating });

   return review;
}


export const getInstructorReviewService = async ({ instructorId }) => {
   const reviews = await InstructorReview.find({ instructorId });
   return reviews;
}


export const updateInstructorReviewService = async ({ instructorId, reviewId, dataToUpdate }) => {

   const updatedReviews = await InstructorReview.findByIdAndUpdate(
      reviewId,
      dataToUpdate,
      { new: true }
   );

   const reviews = await InstructorReview.find({ instructorId });
   const avgRating = parseFloat(reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1);

   await axios.put(`${INSTRUCTOR_SERVICE_URL}/api/v1/public/instructors/${instructorId}`, { avgRating });

   return updatedReviews;
}


export const delInstructorReviewService = async ({ instructorId, reviewId }) => {
   const delreviews = await InstructorReview.findByIdAndDelete(reviewId);

   const reviews = await InstructorReview.find({ instructorId });
   const avgRating = parseFloat(reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1);

   await axios.put(`${INSTRUCTOR_SERVICE_URL}/api/v1/public/instructors/${instructorId}`, { avgRating });

   return delreviews;
}


// instructor
export const getMyCourseReviewsService = async ({ courseId }) => {
   const reviews = await Review.find({ courseId });
   return reviews;
}