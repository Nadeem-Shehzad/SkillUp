import {
   addReviewService,
   deleteReviewService,
   getCourseReviewsService,
   updateReviewService
} from "../services/review.service.js";



export const getReviews = async (req, res, next) => {
   try {
      const courseId = req.courseId;
      const reviews = await getCourseReviewsService({ courseId });

      res.status(200).json({ success: true, message: 'Course Reviews.', data: reviews });
   } catch (error) {
      next(error);
   }
}


export const addReview = async (req, res, next) => {
   try {
      const courseId = req.params.courseId;
      const studentId = req.user.id;

      const { rating, comment } = req.body;

      const review = await addReviewService({ studentId, courseId, rating, comment });

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