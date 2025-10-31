import express from "express";

import { getCourseSummary, updateCourseRating, checkCourseExits } from "../controllers/public.controller.js";


const router = express.Router();

// public
router.route('/summary/:courseId').get(getCourseSummary);
router.route('/exists/:courseId').get(checkCourseExits);
router.route('/rating/:courseId').put(updateCourseRating);

export default router;