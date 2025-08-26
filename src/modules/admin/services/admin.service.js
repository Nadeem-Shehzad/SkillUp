import { ApiError, constants } from "@skillup/common-utils";
import { Admin } from "../model/admin.model.js";
import { AuthClientService } from "./client/authClient.service.js";



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