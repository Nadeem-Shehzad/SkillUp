import express from 'express';

import { ValidateToken } from '../../../middlewares/validateToken.js';

import {
    getProfile,
    updateProfile,
    addCourseToBookmark
} from '../controllers/student.controller.js';


const router = express.Router();

router.route('/profile')
    .post(ValidateToken, getProfile)
    .put(ValidateToken, updateProfile);

router.route('/').post(ValidateToken, addCourseToBookmark);

//POST / api / student / bookmarks /:courseId	Add course to bookmarks
//GET	/api/student/bookmarks	List all bookmarked courses
//DELETE	/api/student/bookmarks/:courseId	Remove course from bookmarks

//POST	/api/student/enroll/:courseId	Enroll in a course
//GET	/api/student/enrolled-courses	Get all enrolled courses
//GET	/api/student/enrolled-courses/:id	Get specific enrolled course details
//DELETE	/api/student/enroll/:courseId	Unenroll from a course (optional)

export default router;