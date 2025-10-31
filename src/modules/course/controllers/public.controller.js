import { ApiError, constants, logger } from "@skillup/common-utils";
import { CoursePublicService } from "../services/public/coursePublic.service.js";


export const getCourseSummary = async (req, res, next) => {
   try {
      const courseId = req.params.courseId;
      const { courseName, instructor } = await CoursePublicService.getCourseSummary(courseId);
      if (!courseName || !instructor) {
         throw new ApiError(constants.NOT_FOUND, 'Either Course or Inst. data not found!');
      }

      return res.status(200).json({ courseName, instructor });

   } catch (error) {
      next(error);
   }
}


export const checkCourseExits = async (req, res, next) => {
   try {
      const courseId = req.params.courseId;
      const course = await CoursePublicService.courseExists(courseId);

      return res.status(200).json(course);

   } catch (error) {
      next(error);
   }
}


export const updateCourseRating = async (req, res, next) => {
   try {
      const courseId = req.params.courseId;
      const { avgRating, totalReviews } = req.body;

      const course = await CoursePublicService.updateCourseRating(courseId, avgRating, totalReviews);

      return res.status(200).json({ course });

   } catch (error) {
      next(error);
   }
}