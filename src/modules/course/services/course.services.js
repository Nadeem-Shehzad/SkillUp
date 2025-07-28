import { Course } from "../models/course.model.js"


export const allCourses = async () => {
   const courses = await Course.find({});
   return courses;
}


export const createCourse = async (req) => {
   const {
      title,
      slug,
      description,
      category,
      level,
      price,
      discount,
      tags,
      language,
      totalLectures,
      instructor,
      isPublished
   } = req.body;

   const content = req.body.content ? JSON.parse(req.body.content): [];

   const course = await Course.create({
      title,
      description,
      category,
      level,
      price,
      discount,
      tags,
      language,
      totalLectures,
      content,
      instructor,
      isPublished,
   });

   return course;
}