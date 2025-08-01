import express from "express";

import { ValidateToken } from "../../../middlewares/validateToken.js";
import { checkRole } from "../../../middlewares/checkRole.js";

import {
   getAllCourses,
   addCourse,
   addCourseContent,
   getSingleInstructorCourses,
   getAllInstructors,
   unpublishCourse,
   publishCourse,
   deleteCourse,
   updateCourse,
   updateCourseContent,
   deleteCourseContent,
   getCourseContents,
   getCourseContent
} from "../controllers/course.controllers.js";
import { createCourseValidator, updateCourseValidator } from "../validators/course.validator.js";
import { contentValidator, updateContentValidator } from "../validators/content.validator.js";

const router = express.Router();

router.route('/')
   .get(getAllCourses)
   .post(
      createCourseValidator,
      ValidateToken,
      checkRole('instructor'),
      addCourse
   );


router.route('/all-instructors').get(getAllInstructors);

router.route('/instructor/:id')
   .get(getSingleInstructorCourses);

router.route('/publish/:courseId')
   .post(ValidateToken, checkRole('instructor'), publishCourse);

router.route('/unpublish/:courseId')
   .post(ValidateToken, checkRole('instructor'), unpublishCourse);

router.route('/:id')
   .put(
      updateCourseValidator,
      ValidateToken,
      checkRole('instructor'),
      updateCourse
   ).delete(ValidateToken, checkRole('instructor'), deleteCourse);


// content apis   
router.route('/add-content').post(
   contentValidator,
   ValidateToken,
   checkRole('instructor'),
   addCourseContent
);

router.route('/all-contents/:courseId').get(getCourseContents);
router.route('/content/:id').get(getCourseContent);

router.route('/update-content/:id').put(
   updateContentValidator,
   ValidateToken,
   checkRole('instructor'),
   updateCourseContent
);

router.route('/delete-content/:id').delete(
   ValidateToken,
   checkRole('instructor'),
   deleteCourseContent
);


export default router;