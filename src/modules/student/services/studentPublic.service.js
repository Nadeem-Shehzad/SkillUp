import { Student } from "../models/student.model.js";

export const StudentPublicService = {
   async studentExists(studentId) {
      const student = await Student.findOne({ user: studentId });
      return student;
   }
}