import express from "express";

import { checkRole } from "../../../middlewares/checkRole.js";
import { ValidateToken } from "../../../middlewares/validateToken.js";

import {
   getReviews,
   addReview,
   deleteReview,
   updateReview
} from "../controllers/review.controller.js";

import {
   checkCourseExits,
   checkEnrollment,
   checkStudentExits
} from '../middleware/external.middlewares.js'
import { isValidStudent } from "../middleware/review.middlewares.js";


const router = express.Router();


//public
router.route('/:courseId').get(checkCourseExits, getReviews);


//student
router.route('/:courseId')
   .post(
      ValidateToken,
      checkStudentExits,
      checkRole('student'),
      checkCourseExits,
      checkEnrollment,
      addReview
   );

router.route('/:reviewId')
   .put(
      ValidateToken,
      checkStudentExits,
      checkRole('student'),
      isValidStudent,
      updateReview
   );

router.route('/:reviewId')
   .delete(
      ValidateToken,
      checkStudentExits,
      checkRole('student'),
      isValidStudent,
      deleteReview
   );


export default router;