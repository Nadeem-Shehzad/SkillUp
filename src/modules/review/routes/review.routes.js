import express from "express";

import { checkRole } from "../../../middlewares/checkRole.js";
import { ValidateToken } from "../../../middlewares/validateToken.js";

import {
   getReviews,
   addReview,
   deleteReview,
   updateReview,
   myReviews,
   myCourseReviews,
   admin_deleteReview,
   courseReviewsAnalytics,
   topRatedCourses
} from "../controllers/courseReview.controller.js";

import {
   checkCourseExits,
   checkCourseOwner,
   checkEnrollment,
   checkInstructorExists,
   checkStudentExists
} from '../middleware/external.middlewares.js';

import {
   checkReviewExists,
   isValidStudent
} from "../middleware/review.middlewares.js";

import { 
   addReviewsANDRating, 
   getReviewsANDRating 
} from "../controllers/instructorReview.controller.js";


const router = express.Router();


// public
router.route('/courses/top-rated')
   .get(topRatedCourses);


//student
router.route('/my-reviews')
.get(
   ValidateToken,
      checkStudentExists,
      checkRole('student'),
      myReviews
   );

router.route('/:courseId')
   .post(
      ValidateToken,
      checkStudentExists,
      checkRole('student'),
      checkCourseExits,
      checkEnrollment,
      addReview
   );

router.route('/:reviewId')
   .put(
      ValidateToken,
      checkStudentExists,
      checkRole('student'),
      isValidStudent,
      checkReviewExists,
      updateReview
   );

router.route('/:reviewId')
   .delete(
      ValidateToken,
      checkStudentExists,
      checkRole('student'),
      isValidStudent,
      checkReviewExists,
      deleteReview
   );


// instructor's review-rating
router.route('/instructor/:id/reviews-rating')
   .post(ValidateToken, checkRole('student'), addReviewsANDRating)
   .get(getReviewsANDRating);



//public
router.route('/:courseId').get(checkCourseExits, getReviews);

router.route('/reviews-analytics/:courseId')
   .get(checkCourseExits, courseReviewsAnalytics);



// instructor
router.route('/my-course/:courseId')
   .get(
      ValidateToken,
      checkInstructorExists,
      checkRole('instructor'),
      checkCourseOwner,
      myCourseReviews
   );



// admin
router.route('/admin/:reviewId')
   .delete(
      ValidateToken,
      checkRole('admin'),
      checkReviewExists,
      admin_deleteReview
   );



export default router;