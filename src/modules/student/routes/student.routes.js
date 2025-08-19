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

export default router;