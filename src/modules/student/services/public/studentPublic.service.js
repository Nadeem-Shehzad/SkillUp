
import { Student } from "../../models/student.model.js";
import { EnrollmentClientService } from "../client/enrollmentClient.service.js";


export const StudentPublicService = {

   createStudent(userId) {
      return Student.create({ user: userId });
   },

   studentExists(studentId) {
      return Student.findOne({ user: studentId });
   },

   enrolledWithInstructor(studentId, instructorId) {
      return EnrollmentClientService.enrolledWithInstructor(studentId, instructorId);
   }
}