import express from "express";

import { ValidateToken } from "../../../middlewares/validateToken.js";
import { checkRole } from "../../../middlewares/checkRole.js";

import { getAllCourses, addCourse } from "../controllers/course.controllers.js";

const router = express.Router();

router.route('/')
   .get(getAllCourses)
   .post(ValidateToken, checkRole('instructor'), addCourse);

export default router;