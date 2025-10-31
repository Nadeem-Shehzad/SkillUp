import express from 'express';
import { checkStudentEnrollment, checkStudentExists } from '../controllers/public.controller.js';


const router = express.Router();

router.route('/exists/:studentId').get(checkStudentExists);
router.route('/check-enrollment').post(checkStudentEnrollment);

export default router;