
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
   },

   allStudents({ page, limit }) {
      return Student.find({})
         .populate('user', 'name email isVerified')
         .skip((page - 1) * limit).limit(limit);
   },

   findStudent({ studentId }) {
      return Student.findById(studentId).populate('user', 'name email isVerified');
   },

   updateStudentStatus({ studentId, isblocked }) {
      return Student.findByIdAndUpdate(studentId, {
         isblocked
      }, { new: true });
   },
}