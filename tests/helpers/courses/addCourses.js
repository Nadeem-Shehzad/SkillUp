import { Course } from "../../../src/modules/course/models/course.model";



export const addCourses = async ({instructorId}) => {
   const createdCourses = await Course.create([
      { title: 'Course 1', description: 'CC', category: 'programming', price: 1000, instructor: instructorId },
      { title: 'Course 2', description: 'CC', category: 'programming', price: 1000, instructor: instructorId },
      { title: 'Course 3', description: 'CC', category: 'programming', price: 1000, instructor: instructorId }
   ]);

   return createdCourses;
}

