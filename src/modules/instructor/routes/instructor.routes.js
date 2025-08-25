import express from 'express';

import { ValidateToken } from '../../../middlewares/validateToken.js';

import {
   getInstructorProfile,
   updateInstructorProfile
} from '../controllers/instructor.controller.js';


const router = express.Router();

router.route('/profile')
   .get(ValidateToken, getInstructorProfile)
   .put(ValidateToken, updateInstructorProfile);

// dashboard -- revenue, enrollments, top-courses, etc

export default router;