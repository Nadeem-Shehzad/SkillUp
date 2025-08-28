import express from 'express';

import { ValidateToken } from '../../../middlewares/validateToken.js';
import { checkRole } from '../../../middlewares/checkRole.js';
import { 
   checkCourseExists, 
   checkEnrollmentExists, 
   checkInstructorExists, 
   checkStudentExists 
} from '../middlewares/external.middlewares.js';

import {
   checkSuperAdminRole,
   checkAdminExists,
   verifyAdmin
} from '../middlewares/admin.middlewares.js';

import {
   getAdminProfile,
   assignAdminPermission,
   verifyAdminStatus,
   publishCourse,
   unpublishCourse,
   getCourses,
   getSingleCourse,
   getInstructors,
   getSingleInstructor,
   updateInstructorStatus,
   getStudents,
   getSingleStudent,
   updateStudentStatus,
   studentEnrollments,
   courseEnrollments,
   updateEnrollment,
   deleteEnrollment,
   enrollmentAllStats,
   coursesAllStats,
} from '../controllers/admin.controller.js';


const router = express.Router();


router.route('/profile').get(
   ValidateToken,
   getAdminProfile
);


router.route('/assign-role/:adminId').post(
   ValidateToken,
   checkAdminExists(),
   checkSuperAdminRole(),
   assignAdminPermission
);


router.route('/verify-admin/:adminId').post(
   ValidateToken,
   checkAdminExists(),
   checkSuperAdminRole(),
   verifyAdminStatus
);


// courses 
router.route('/courses').get(
   ValidateToken,
   checkRole('admin'),
   verifyAdmin(),
   getCourses
);

router.route('/courses/:courseId').get(
   ValidateToken,
   checkRole('admin'),
   verifyAdmin(),
   getSingleCourse
);

router.route('/courses/:courseId/approve').post(
   ValidateToken,
   checkRole('admin'),
   checkCourseExists,
   publishCourse
);

router.route('/courses/:courseId/reject').post(
   ValidateToken,
   checkRole('admin'),
   checkCourseExists,
   unpublishCourse
);

router.route('/courses/:courseId/enrollments').get(
   ValidateToken,
   checkRole('admin'),
   checkCourseExists,
   courseEnrollments
);

router.route('/all-stats/courses').get(
   ValidateToken,
   checkRole('admin'),
   verifyAdmin(),
   coursesAllStats
);



// instructors 
router.route('/instructors').get(
   ValidateToken,
   checkRole('admin'),
   verifyAdmin(),
   getInstructors
);

router.route('/instructors/:instructorId').get(
   ValidateToken,
   checkRole('admin'),
   verifyAdmin(),
   getSingleInstructor
);

router.route('/instructors/:instructorId/update-status').put(
   ValidateToken,
   checkRole('admin'),
   verifyAdmin(),
   checkInstructorExists,
   updateInstructorStatus
);



//students 
router.route('/students').get(
   ValidateToken,
   checkRole('admin'),
   verifyAdmin(),
   getStudents
);

router.route('/students/:studentId').get(
   ValidateToken,
   checkRole('admin'),
   verifyAdmin(),
   getSingleStudent
);

router.route('/students/:studentId/update-status').put(
   ValidateToken,
   checkRole('admin'),
   verifyAdmin(),
   checkStudentExists,
   updateStudentStatus
);

router.route('/students/:studentId/enrollments').get(
   ValidateToken,
   checkRole('admin'),
   verifyAdmin(),
   checkStudentExists,
   studentEnrollments
);



// enrollments
router.route('/:enrollmentId/update-enrollment').put(
   ValidateToken,
   checkRole('admin'),
   verifyAdmin(),
   checkEnrollmentExists,
   updateEnrollment
);

router.route('/:enrollmentId/delete-enrollment').delete(
   ValidateToken,
   checkRole('admin'),
   verifyAdmin(),
   checkEnrollmentExists,
   deleteEnrollment
);

router.route('/all-stats/enrollments').get(
   ValidateToken,
   checkRole('admin'),
   verifyAdmin(),
   enrollmentAllStats
);


export default router;