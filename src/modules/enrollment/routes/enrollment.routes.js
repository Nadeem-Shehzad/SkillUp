import express from "express";

import { checkRole } from "../../../middlewares/checkRole.js";
import { ValidateToken } from "../../../middlewares/validateToken.js";

import {
   courseEnrollment,
   enrolledCourseDetails,
   enrolledCourses,
   enrolledStudents,
   topEnrollmentCourses,
   getInstructorAllCoursesAndEnrollments,
} from "../controllers/enrollment.controller.js";


const router = express.Router();


//public
router.route('/courses/top-enrollments').get(topEnrollmentCourses);
router.route('/instructor/:instructorId/count').get(getInstructorAllCoursesAndEnrollments);


// student
router.route('/enroll/:courseId')
   .post(ValidateToken, checkRole('student'), courseEnrollment);

router.route('/enrolled-courses')
   .get(ValidateToken, checkRole('student'), enrolledCourses);

router.route('/enrolled-courses/:enrollId')
   .get(ValidateToken, checkRole('student'), enrolledCourseDetails);

//DELETE	/api/student/enroll/:courseId	Unenroll from a course (optional)


// instructor
router.route('/course/:courseId')
   .get(ValidateToken, checkRole('instructor'), enrolledStudents);
   


export default router;