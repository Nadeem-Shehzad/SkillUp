import { ApiError, constants, logger } from "@skillup/common-utils";
import { CoursePublicService } from "../services/public/coursePublic.service.js";


export const getCourseSummary = async (req, res, next) => {
   try {
      const courseId = req.params.courseId;
      const { courseName, instructor } = await CoursePublicService.getCourseSummary(courseId);
      if (!courseName || !instructor) {
         throw new ApiError(constants.NOT_FOUND, 'Either Course or Inst. data not found!');
      }

      logger.info('inside public controller');
      logger.info(`CourseName --> ${courseName}`);
      logger.info(`Instructor --> ${instructor.name}`);

      return res.status(200).json({ courseName, instructor });

   } catch (error) {
      next(error);
   }
}


export const updateCourseRating = async (req, res, next) => {
   try {
      const courseId = req.params.courseId;
      const { avgRating, totalReviews } = req.body;

      const course = await CoursePublicService.updateCourseRating(courseId, avgRating, totalReviews);

      logger.warn(`<--- Rating updated --->`);
      return res.status(200).json({ course });

   } catch (error) {
      next(error);
   }
}