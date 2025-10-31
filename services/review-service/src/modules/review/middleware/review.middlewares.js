import mongoose from "mongoose";

import { ApiError, constants, logger } from "@skillup/common-utils";

import { Review } from "../models/courseReview.model.js";
import { InstructorReview } from "../models/instructorReview.model.js";


export const isValidStudent = async (req, res, next) => {
   //const studentId = req.user.id;
   const studentId = req.userId;
   const reviewId = req.params.reviewId;

   if (!mongoose.Types.ObjectId.isValid(reviewId)) {
      throw new ApiError(constants.VALIDATION_ERROR, 'Invalid Review ID!');
   }

   const review = await Review.findById(reviewId);
   if (!review) {
      throw new ApiError(constants.NOT_FOUND, 'Review not Found!');
   }

   if (studentId.toString() !== review.studentId.toString()) {
      throw new ApiError(constants.FORBIDDEN, 'Access Denied: as u r not owner of this review!');
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


// instructor
export const IR_isValidStudent = async (req, res, next) => {
   const studentId = req.user.id;
   const reviewId = req.params.reviewId;

   if (!mongoose.Types.ObjectId.isValid(reviewId)) {
      throw new ApiError(constants.VALIDATION_ERROR, 'Invalid IR_Review ID!');
   }

   const review = await InstructorReview.findById(reviewId);
   if (!review) {
      throw new ApiError(constants.NOT_FOUND, 'IR_Review not Found!');
   }

   if (studentId.toString() !== review.studentId.toString()) {
      throw new ApiError(constants.FORBIDDEN, 'Access Denied!');
   }

   req.reviewId = review._id;
   req.instructorId = review.instructorId;
   next();
}   