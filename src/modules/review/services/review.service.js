
import { constants } from "../../../constants/statusCodes.js";
import ApiError from "../../../utils/apiError.js";
import { Review } from "../models/review.model.js";
import { CourseClientService } from "./courseClient.service.js";


export const getCourseReviewsService = async ({ courseId }) => {
   const reviews = await Review.find({ courseId });
   return reviews;
}


export const addReviewService = async ({ studentId, courseId, rating, comment }) => {

   const reviewExists = await Review.findOne({
      courseId,
      studentId
   });

   if (reviewExists) {
      throw new ApiError(constants.FORBIDDEN, "You already reviewed this course");
   }

   const review = await Review.create({
      studentId,
      courseId,
      rating,
      comment
   });

   const reviews = await Review.find({ courseId });
   const avgRating = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;

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
   const avgRating = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;

   await CourseClientService.updateCourseRating(courseId, avgRating, reviews.length);

   return updatedReview;
}


export const deleteReviewService = async ({ reviewId, courseId }) => {

   const deletedReview = await Review.findByIdAndDelete(reviewId);

   if (!deletedReview) {
      throw new ApiError(constants.NOT_FOUND, "Review not found or already deleted!");
   }

   const reviews = await Review.find({ courseId });
   const avgRating = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;

   await CourseClientService.updateCourseRating(courseId, avgRating, reviews.length);
}