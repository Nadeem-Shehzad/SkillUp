import {
   addInstructorReviewService,
   delInstructorReviewService,
   getInstructorReviewService,
   updateInstructorReviewService
} from "../services/review.service.js";



export const addReviewsANDRating = async (req, res, next) => {
   try {
      const studentId = req.user.id;
      const studentAuthID = req.userId;
      const instructorId = req.params.instructorId;
      const { rating, comment } = req.body;

      const review = await addInstructorReviewService({ studentId, studentAuthID, instructorId, rating, comment });

      res.status(201).json({ success: true, message: 'review added.', data: review });
   } catch (error) {
      next(error);
   }
}


export const getReviewsANDRating = async (req, res, next) => {
   try {
      const instructorId = req.params.instructorId;

      const review = await getInstructorReviewService({ instructorId });

      res.status(201).json({ success: true, message: 'Instructor All Reviews.', data: review });
   } catch (error) {
      next(error);
   }
}


export const updateReviewsANDRating = async (req, res, next) => {
   try {
      const instructorId = req.instructorId;
      const reviewId = req.reviewId;
      const dataToUpdate = req.body;

      const review = await updateInstructorReviewService({ instructorId, reviewId, dataToUpdate });

      res.status(201).json({ success: true, message: 'review updated.', data: review });
   } catch (error) {
      next(error);
   }
}


export const deleteReviewsANDRating = async (req, res, next) => {
   try {
      const instructorId = req.instructorId;
      const reviewId = req.reviewId;

      const review = await delInstructorReviewService({ instructorId, reviewId });

      res.status(201).json({ success: true, message: 'review deleted.', data: review });
   } catch (error) {
      next(error);
   }
}