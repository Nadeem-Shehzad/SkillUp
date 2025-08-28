import { ApiError, constants } from "@skillup/common-utils";
import { Admin } from '../model/admin.model.js';
import mongoose from "mongoose";


export const checkSuperAdminRole = () => {
   return async (req, res, next) => {
      if (!req.user) {
         throw new ApiError(constants.FORBIDDEN, 'User not Found!');
      }

      const admin = await Admin.findOne({ userId: req.user.id });
      if (!admin) {
         throw new ApiError(constants.NOT_FOUND, 'Super-Admin not Found!');
      }

      if (admin.roleLevel.toString() !== 'super-admin') {
         throw new ApiError(constants.FORBIDDEN, `Sorry, Acces Denied. only super-admin allowed`);
      }

      next();
   }
}


export const verifyAdmin = () => {
   return async (req, res, next) => {
      if (!req.user) {
         throw new ApiError(constants.FORBIDDEN, 'User not Found!');
      }

      if (!mongoose.Types.ObjectId.isValid(req.user.id)) {
         throw new ApiError(constants.VALIDATION_ERROR, 'Invalid Admin ID!');
      }

      const admin = await Admin.findOne({ userId: req.user.id });
      if (!admin) {
         throw new ApiError(constants.NOT_FOUND, 'Admin not Found!');
      }

      if(admin.isApproved === false){
         throw new ApiError(constants.FORBIDDEN, 'Sorry, access denied. as you are not verified by super-admin!');
      }

      if(admin.isBlocked === true){
         throw new ApiError(constants.FORBIDDEN, 'Sorry, access denied. as you are blocked by super-admin!');
      }

      req.adminId = admin._id;
      next();
   }
}


export const checkAdminExists = () => {
   return async (req, res, next) => {
      const adminId = req.params.adminId;

      if (!mongoose.Types.ObjectId.isValid(adminId)) {
         throw new ApiError(constants.VALIDATION_ERROR, 'Invalid Admin ID!');
      }

      if (!adminId) {
         throw new ApiError(constants.VALIDATION_ERROR, 'Admin ID missing!');
      }

      const admin = await Admin.findById(adminId);
      if (!admin) {
         throw new ApiError(constants.NOT_FOUND, 'Admin not Found!');
      }

      next();
   }
}