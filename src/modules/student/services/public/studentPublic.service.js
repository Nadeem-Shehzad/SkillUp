
import { Student } from "../../models/student.model.js";


export const StudentPublicService = {

   createStudent(userId) {
      return Student.create({ user: userId });
   },

   studentExists(studentId) {
      return Student.findOne({ user: studentId });
   },

}