import express from "express";

import { ValidateToken } from "../../../middlewares/validateToken.js";
import { checkRole } from "../../../middlewares/checkRole.js";

import { getAllCourses, addCourse, addCourseContent } from "../controllers/course.controllers.js";

const router = express.Router();

router.route('/')
   .get(getAllCourses)
   .post(ValidateToken, checkRole('instructor'), addCourse);

router.route('/add-content').post(ValidateToken, checkRole('instructor'), addCourseContent);

export default router;