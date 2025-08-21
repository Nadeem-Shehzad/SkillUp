import mongoose from "mongoose";
import { constants } from "../../../constants/statusCodes.js";
import ApiError from "../../../utils/apiError.js";
import { Review } from "../models/review.model.js";


export const isValidStudent = async (req, res, next) => {
   const studentId = req.user.id;
   const reviewId = req.params.reviewId;

   if (!mongoose.Types.ObjectId.isValid(reviewId)) {
      throw new ApiError(constants.VALIDATION_ERROR, 'Invalid Review ID!');
   }

   const review = await Review.findById(reviewId);
   if (!review) {
      throw new ApiError(constants.NOT_FOUND, 'Review not Found!');
   }

   if (studentId.toString() !== review.studentId.toString()) {
      throw new ApiError(constants.FORBIDDEN, 'Access Denied!');
   }

   req.courseId = review.courseId;
   next();
}


export const checkReviewExists = async (req, res, next) => {
   try {
      const reviewId = req.params.reviewId;

      const review = await Review.findById(reviewId);
      if (!review) {
         throw new ApiError(constants.NOT_FOUND, 'Review not Found!');
      }

      req.reviewId = reviewId;
      req.courseId = review.courseId;
      next();

   } catch (error) {
      next(error);
   }
}