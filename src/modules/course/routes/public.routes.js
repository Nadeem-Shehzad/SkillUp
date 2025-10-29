import express from "express";

import { getCourseSummary, updateCourseRating } from "../controllers/public.controller.js";


const router = express.Router();

// public
router.route('/summary/:courseId').get(getCourseSummary);
router.route('/rating/:courseId').put(updateCourseRating);

export default router;