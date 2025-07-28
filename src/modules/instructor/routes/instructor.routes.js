import express from 'express';

import { ValidateToken } from '../../../middlewares/validateToken.js';
import { checkRole } from '../../../middlewares/checkRole.js';

import {
   getInstructorProfile,
   updateInstructorProfile
} from '../controllers/instructor.controller.js';


const router = express.Router();

router.route('/profile')
   .get(ValidateToken, getInstructorProfile)
   .put(ValidateToken, updateInstructorProfile);

export default router;