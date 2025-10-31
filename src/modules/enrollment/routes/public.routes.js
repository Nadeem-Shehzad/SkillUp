import express from "express";

import { checkEnrollment } from "../controllers/public.controller.js";


const router = express.Router();


router.route('/check-enrollment/:courseId').post(checkEnrollment);


export default router;