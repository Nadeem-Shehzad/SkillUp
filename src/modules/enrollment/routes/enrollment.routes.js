import express from "express";

import { checkRole } from "../../../middlewares/checkRole.js";
import { ValidateToken } from "../../../middlewares/validateToken.js";

import {
   admin_allStats,
   admin_courseEnrollments,
   admin_deleteEnrollment,
   admin_studentEnrollments,
   admin_updateEnrollment,
   courseEnrollment,
   enrolledCourseDetails,
   enrolledCourses,
   enrolledStudents,
   topEnrollmentCourses,
} from "../controllers/enrollment.controller.js";


const router = express.Router();


//public
router.route('/courses/top-enrollments').get(topEnrollmentCourses);


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



// admin   
router.route('/admin/student/:studentId')
   .get(ValidateToken, checkRole('admin'), admin_studentEnrollments);
   
router.route('/admin/courses/:courseId')
   .get(ValidateToken, checkRole('admin'), admin_courseEnrollments); 
   
router.route('/admin/update-enrollment/:id')
   .put(ValidateToken, checkRole('admin'), admin_updateEnrollment);
   
router.route('/admin/delete-enrollment/:id')
   .delete(ValidateToken, checkRole('admin'), admin_deleteEnrollment);

router.route('/admin/all-stats')
   .get(ValidateToken, checkRole('admin'), admin_allStats);   


export default router;