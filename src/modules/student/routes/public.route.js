import express from 'express';
import { checkStudentExists } from '../controllers/public.controller.js';


const router = express.Router();

router.route('/exists/:studentId').get(checkStudentExists);

export default router;