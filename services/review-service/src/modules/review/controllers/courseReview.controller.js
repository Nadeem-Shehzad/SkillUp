import mongoose from "mongoose";
import {
   addReviewService,
   deleteReviewService,
   getCourseReviewsAnalyticsService,
   getCourseReviewsService,
   getMyCourseReviewsService,
   getMyReviewsService,
   getTopRatedCoursesService,
   updateReviewService
} from "../services/review.service.js";


// public
export const getReviews = async (req, res, next) => {
   try {
      const courseId = req.courseId;
      const reviews = await getCourseReviewsService({ courseId });

      res.status(200).json({ success: true, message: 'Course Reviews.', data: reviews });
   } catch (error) {
      next(error);
   }
}


export const courseReviewsAnalytics = async (req, res, next) => {
   try {
      const courseId = req.courseId;
      const analytics = await getCourseReviewsAnalyticsService({ courseId });

      res.status(200).json({ success: true, message: 'Course Reviews Analytics.', data: analytics });
   } catch (error) {
      next(error);
   }
}


export const topRatedCourses = async (req, res, next) => {
   try {
      const courses = await getTopRatedCoursesService();

      res.status(200).json({ success: true, message: 'Top Rated Courses.', data: courses });
   } catch (error) {
      next(error);
   }
}





//student
export const addReview = async (req, res, next) => {
   try {
      const courseId = req.params.courseId;
      const studentId = req.userId;
      const studentAuthID = new mongoose.Types.ObjectId("6900bae0890dca50ddd7df68");;//req.userId;

      const { rating, comment } = req.body;

      const review = await addReviewService({ studentId, studentAuthID, courseId, rating, comment });

      res.status(201).json({ success: true, message: 'review added.', data: review });
   } catch (error) {
      next(error);
   }
}


export const updateReview = async (req, res, next) => {
   try {
      const reviewId = req.params.reviewId;
      const courseId = req.courseId;
      const dataToUpdate = req.body;

      const review = await updateReviewService({ reviewId, courseId, dataToUpdate });

      res.status(200).json({ success: true, message: 'review updated.', data: review });
   } catch (error) {
      next(error);
   }
}


export const deleteReview = async (req, res, next) => {
   try {
      const reviewId = req.params.reviewId;
      const courseId = req.courseId;

      const review = await deleteReviewService({ reviewId, courseId });

      res.status(200).json({ success: true, message: 'review deleted.', data: null });
   } catch (error) {
      next(error);
   }
}


export const myReviews = async (req, res, next) => {
   try {
      const studentId = req.user.id;
      const reviews = await getMyReviewsService({ studentId });

      res.status(200).json({ success: true, message: 'Your Reviews.', data: reviews });
   } catch (error) {
      next(error);
   }
}





// instructor
export const myCourseReviews = async (req, res, next) => {
   try {
      const courseId = req.courseId;
      const reviews = await getMyCourseReviewsService({ courseId });

      res.status(200).json({ success: true, message: 'Your Course Reviews.', data: reviews });
   } catch (error) {
      next(error);
   }
}



// admin
export const admin_deleteReview = async (req, res, next) => {
   try {
      const reviewId = req.reviewId;
      const courseId = req.courseId;

      const review = await deleteReviewService({ reviewId, courseId });

      res.status(200).json({ success: true, message: 'admin: review deleted.', data: null });
   } catch (error) {
      next(error);
   }
}