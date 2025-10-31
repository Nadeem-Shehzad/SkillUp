import express from 'express';
import {
   checkInstructor,
   InstructorData,
   updateInstructorData
} from '../controllers/public.controller.js';


const router = express.Router();

router.route('/check/:instructorId').get(checkInstructor);
router.route('/:instructorId').get(InstructorData);
router.route('/:instructorId').put(updateInstructorData);

export default router;