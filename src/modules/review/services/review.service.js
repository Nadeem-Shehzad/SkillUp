import mongoose from "mongoose";

import { ApiError, constants } from "@skillup/common-utils";

import { Review } from "../models/courseReview.model.js";
import { 
   totalStats, 
   ratingDistribution, 
   latestReviews 
} from "../pipelines/review.pipelines.js";

import { AuthClientService } from "./client/authClient.service.js";
import { CourseClientService } from "./client/courseClient.service.js";




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
   const user = await AuthClientService.getUserInfo(studentAuthID);

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





// instructor
export const getMyCourseReviewsService = async ({ courseId }) => {

   const reviews = await Review.find({ courseId });

   return reviews;
}