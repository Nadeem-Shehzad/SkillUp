import { ApiError, constants } from "@skillup/common-utils";
import { Admin } from "../model/admin.model.js";
import { AuthClientService } from "./client/authClient.service.js";
import { CourseClientService } from "./client/courseClient.service.js";
import { InstructorClientService } from "./client/instructorClient.service.js";
import { StudentClientService } from "./client/studentClient.service.js";
import { EnrollmentClientService } from "./client/enrollmentClient.service.js";



export const getAdminProfileService = async ({ adminId }) => {
   const admin = await Admin.findById(adminId).select('userId permissions roleLevel isApproved isBlocked');
   const admin_userInfo = await AuthClientService.getAdminProfileData(admin.userId);

   const userObj = admin_userInfo.toObject();
   const adminObj = admin.toObject();

   const adminData = {
      ...userObj,
      ...adminObj
   };

   return adminData;
}


export const assignAdminPermissionService = async ({ adminId, permissions }) => {
   if (!Array.isArray(permissions) || permissions.length === 0) {
      throw new ApiError(constants.VALIDATION_ERROR, `Permissions must be a non-empty array`);
   }

   const allowedPermissions = [
      "manage_courses",
      "manage_users",
      "manage_enrollments",
      "approve_instructors",
      "payouts",
      "reports"
   ];

   const invalidPermissions = permissions.filter(p => !allowedPermissions.includes(p));
   if (invalidPermissions.length > 0) {
      throw new ApiError(constants.BAD_REQUEST, `Invalid roles: ${invalidPermissions.join(", ")}`);
   }

   const updatedAdmin = await Admin.findOneAndUpdate(
      { adminId },
      { $set: { permissions } },
      { new: true }
   );

   if (!updatedAdmin) {
      throw new ApiError(constants.NOT_FOUND, "Admin not found");
   }

   return updatedAdmin;
}


export const verifyAdminService = async ({ adminId }) => {

   const updatedAdmin = await Admin.findByIdAndUpdate(
      adminId,
      { $set: { isApproved: true } },
      { new: true }
   );

   if (!updatedAdmin) {
      throw new ApiError(constants.NOT_FOUND, "Admin not Updating...");
   }

   const dataToUpdate = {
      isVerified: true
   }

   const userId = updatedAdmin.userId;
   await AuthClientService.updateUserStatus({ userId, dataToUpdate });

   return updatedAdmin;
}


// courses
export const getAllCourses = async ({ page, limit }) => {
   return CourseClientService.getAllCourses({ page, limit })
}


export const getCourse = async ({ courseId }) => {
   return CourseClientService.getCourse({ courseId });
}


export const publish_Course = async ({ courseId }) => {
   return CourseClientService.approveCourse({ courseId });
}


export const unpublish_Course = async ({ courseId, reason }) => {
   return CourseClientService.rejectCourse({ courseId, reason });
}


export const courseEnrollmentService = async ({ courseId }) => {
   return EnrollmentClientService.getCourseEnrollments({ courseId });
}


// instructors
export const getAllInstructorsDataService = async ({ page, limit }) => {
   return InstructorClientService.getAllInstructorsData({ page, limit });
}


export const getSingleInstructorDataService = async ({ instructorId }) => {
   return InstructorClientService.getInstructorData({ instructorId });
}


export const updateInstructorStatusService = async ({ instructorId, status }) => {
   return InstructorClientService.updateInstructorStatus({ instructorId, status });
}



//students
export const getAllStudentsDataService = async ({ page, limit }) => {
   return StudentClientService.getStudents({ page, limit });
}


export const getSingleStudentDataService = async ({ studentId }) => {
   return StudentClientService.findOneStudent({ studentId });
}


export const updateStudentStatusService = async ({ studentId, isblocked }) => {
   return StudentClientService.updateStudentStatus({ studentId, isblocked });
}


export const studentEnrollmentService = async ({ studentId }) => {
   return EnrollmentClientService.getStudentEnrollments({ studentId });
}



//enrollments
export const updateEnrollmentService = async ({ enrollmentId, dataToUpdate }) => {
   return EnrollmentClientService.updateEnrollment({ enrollmentId, dataToUpdate });
}


export const deleteEnrollmentService = async ({ enrollmentId }) => {
   return EnrollmentClientService.deleteEnrollment({ enrollmentId });
}


export const enrollmentAllStatsService = async () => {
   return EnrollmentClientService.enrollmentAllStats();
}