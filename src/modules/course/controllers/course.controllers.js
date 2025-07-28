import { allCourses, createCourse } from "../services/course.services.js";


export const getAllCourses = async (req, res, next) => {
   try {
      const courses = await allCourses();
      return res.status(200).json({ success: true, message: 'All Courses', data: courses });

   } catch (error) {
      next(error);
   }
}


export const addCourse = async (req, res, next) => {
   try {

      const course = await createCourse(req);

      res.status(200).json({ success: true, message: 'Course created Successfully.', data: course });

   } catch (error) {
      next(error);
   }
}
