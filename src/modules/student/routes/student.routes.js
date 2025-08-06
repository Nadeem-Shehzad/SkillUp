import express from 'express';

import { ValidateToken } from '../../../middlewares/validateToken.js';

import {
    getProfile,
    updateProfile,
    addCourseToBookmark,
    getBookmarks,
    deleteBookmark
} from '../controllers/student.controller.js';

import { checkRole } from '../../../middlewares/checkRole.js';


const router = express.Router();

router.route('/profile')
    .post(ValidateToken, getProfile)
    .put(ValidateToken, updateProfile);

router.route('/bookmarks/:courseId')
    .post(ValidateToken, checkRole('student'), addCourseToBookmark);

router.route('/bookmarks')
    .get(ValidateToken, getBookmarks);

router.route('/bookmarks/:id')
    .delete(ValidateToken, deleteBookmark);    

//DELETE	/api/student/bookmarks/:courseId	Remove course from bookmarks

//POST	/api/student/enroll/:courseId	Enroll in a course
//GET	/api/student/enrolled-courses	Get all enrolled courses
//GET	/api/student/enrolled-courses/:id	Get specific enrolled course details
//DELETE	/api/student/enroll/:courseId	Unenroll from a course (optional)

export default router;