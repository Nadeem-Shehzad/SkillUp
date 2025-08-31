
import { logger } from "@skillup/common-utils";
import { Student } from "../../models/student.model.js";
import { AuthClientService } from "../client/authClient.service.js";
import { EnrollmentClientService } from "../client/enrollmentClient.service.js";


export const StudentPublicService = {

   createStudent(userId) {
      return Student.create({ user: userId });
   },

   studentExists(userId) {
      return Student.findOne({ user: userId });
   },

   async getStudentUserData(userId) {
      const student = await Student.findOne({ user: userId }).select('_id');
      const user = await AuthClientService.getUserInfo(userId);

      const studentObj = student.toObject();
      const userObj = user.toObject();

      const studentData = {
         ...userObj,
         ...studentObj
      }

      return studentData;
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