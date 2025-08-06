import { Student } from "../../../src/modules/student/models/student.model";


export const createStudent = async ({ stdID }) => {
   const existing = await Student.findOne({ user: stdID });
   if (existing) return existing;

   const student = await Student.create({
      user: stdID,
      bio: 'IT Student.',
   });

   return student;
}