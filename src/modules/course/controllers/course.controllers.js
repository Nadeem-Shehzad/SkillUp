import { validationResult } from "express-validator";

import { verifyUser } from "../../../utils/user.js";
import {
   allCourses,
   createCourse,
   addCourseContents,
   singleInstructorCourses,
   allInstructors,
   unpublish_Course,
   publish_Course,
   delete_Course,
   update_Course,
   deleteCourseContents,
   get_CourseContents,
   get_CourseContent,
   update_CourseContent,
   searchCourseService,
   searchContentsService,
   searchByInstructorService,
   searchTagsService,
   searchCategoryService
} from "../services/course.services.js";

import ApiError, { errorMsg } from "../../../utils/apiError.js";
import { constants } from "../../../constants/statusCodes.js";


export const getAllCourses = async (req, res, next) => {
   try {

      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;

      const courses = await allCourses({ page, limit });
      return res.status(200).json({ success: true, message: 'All Courses', data: courses });
   } catch (error) {
      next(error);
   }
}


export const addCourse = async (req, res, next) => {
   try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
         const errMsg = errorMsg(errors);
         throw new ApiError(constants.VALIDATION_ERROR, errMsg);
      }

      const course = await createCourse(req);
      res.status(201).json({ success: true, message: 'Course created Successfully.', data: course });
   } catch (error) {
      next(error);
   }
}


export const getAllInstructors = async (req, res, next) => {
   try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;

      const instructors = await allInstructors({ page, limit });
      return res.status(200).json({ success: true, message: `All Insatructor's - page: ${page} and limit:${limit}`, data: instructors });
   } catch (error) {
      next(error);
   }
}


export const getSingleInstructorCourses = async (req, res, next) => {
   try {
      const instructorId = req.params.id;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;

      const courses = await singleInstructorCourses({ instructorId, page, limit });
      return res.status(200).json({ success: true, message: `Insatructor's All Courses`, data: courses });
   } catch (error) {
      next(error);
   }
}


export const searchCourses = async (req, res, next) => {
   try {
      const searchQuery = req.query.search;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;

      const courses = await searchCourseService({ searchQuery, page, limit });
      return res.status(200).json({ success: true, message: `Searched Courses.`, data: courses });
   } catch (error) {
      next(error);
   }
}


export const searchContents = async (req, res, next) => {
   try {
      const searchQuery = req.query.search;
      const courseId = req.query.courseId;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;

      const contents = await searchContentsService({ searchQuery, courseId, page, limit });
      return res.status(200).json({ success: true, message: `Searched Contents.`, data: contents });
   } catch (error) {
      next(error);
   }
}


export const searchByInstructor = async (req, res, next) => {
   try {
      const searchQuery = req.query.instructor;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;

      const courses = await searchByInstructorService({ searchQuery, page, limit });
      return res.status(200).json({ success: true, message: `Searched Instructor Courses.`, data: courses });

   } catch (error) {
      next(error);
   }
}


export const searchTags = async (req, res, next) => {
   try {
      const searchQuery = req.query.search;

      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;

      const courses = await searchTagsService({ searchQuery, page, limit });
      return res.status(200).json({ success: true, message: `Searched Tags Course.`, data: courses });
   } catch (error) {
      next(error);
   }
}


export const searchCategory = async (req, res, next) => {
   try {
      const searchQuery = req.query.search;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;

      const courses = await searchCategoryService({ searchQuery, page, limit });
      return res.status(200).json({ success: true, message: `Searched Category Course.`, data: courses });
   } catch (error) {
      next(error);
   }
}


export const publishCourse = async (req, res, next) => {
   try {
      const userId = req.user.id;
      const userRole = req.user.role;
      const instructor = await verifyUser({ userId, userRole });

      const courseId = req.params.courseId;
      const instructorId = instructor._id;
      const course = await publish_Course({ instructorId, courseId });

      return res.status(200).json({ success: true, message: `Course Published.`, data: course });
   } catch (error) {
      next(error);
   }
}


export const unpublishCourse = async (req, res, next) => {
   try {
      const userId = req.user.id;
      const userRole = req.user.role;
      const instructor = await verifyUser({ userId, userRole });

      const courseId = req.params.courseId;
      const instructorId = instructor._id;
      const course = await unpublish_Course({ instructorId, courseId });

      return res.status(200).json({ success: true, message: `Course unPublished.`, data: course });
   } catch (error) {
      next(error);
   }
}


export const updateCourse = async (req, res, next) => {
   try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
         const errMsg = errorMsg(errors);
         throw new ApiError(constants.VALIDATION_ERROR, errMsg);
      }

      const userId = req.user.id;
      const userRole = req.user.role;
      const instructor = await verifyUser({ userId, userRole });

      const courseId = req.params.id;
      const instructorId = instructor._id;
      const dataToUpdate = req.body;
      const imageData = (req.files && req.files.image) ? req.files.image : null;

      const course = await update_Course({ instructorId, courseId, dataToUpdate, imageData });

      return res.status(200).json({ success: true, message: `Course Updated.`, data: null });
   } catch (error) {
      next(error);
   }
}


export const deleteCourse = async (req, res, next) => {
   try {
      const userId = req.user.id;
      const userRole = req.user.role;
      const instructor = await verifyUser({ userId, userRole });

      const courseId = req.params.id;
      const instructorId = instructor._id;
      const course = await delete_Course({ instructorId, courseId });

      return res.status(200).json({ success: true, message: `Course Deleted.`, data: null });
   } catch (error) {
      next(error);
   }
}


// contents api-controllers
export const addCourseContent = async (req, res, next) => {
   try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
         const errMsg = errorMsg(errors);
         throw new ApiError(constants.VALIDATION_ERROR, errMsg);
      }

      const content = await addCourseContents(req);
      res.status(201).json({ success: true, message: 'Course content added.', data: content });
   } catch (error) {
      next(error);
   }
}


export const getCourseContents = async (req, res, next) => {
   try {
      const courseId = req.params.courseId;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;

      const contents = await get_CourseContents({ courseId, page, limit });
      res.status(201).json({ success: true, message: 'Course Contents', data: contents });
   } catch (error) {
      next(error);
   }
}


export const getCourseContent = async (req, res, next) => {
   try {
      const contentId = req.params.id;
      const content = await get_CourseContent({ contentId });
      res.status(201).json({ success: true, message: 'Course Content', data: content });
   } catch (error) {
      next(error);
   }
}


export const updateCourseContent = async (req, res, next) => {
   try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
         const errMsg = errorMsg(errors);
         throw new ApiError(constants.VALIDATION_ERROR, errMsg);
      }

      const contentId = req.params.id;
      const instructorId = req.user.id;
      const dataToUpdate = req.body;
      const videoData = (req.files && req.files.video) ? req.files.video : null;
      const content = await update_CourseContent({ instructorId, contentId, dataToUpdate, videoData });
      res.status(201).json({ success: true, message: 'Course content added.', data: content });
   } catch (error) {
      next(error);
   }
}


export const deleteCourseContent = async (req, res, next) => {
   try {
      const contentId = req.params.id;
      const instructorId = req.user.id;

      await deleteCourseContents({ instructorId, contentId });

      res.status(201).json({ success: true, message: 'Course content deleted.', data: null });
   } catch (error) {
      next(error);
   }
}