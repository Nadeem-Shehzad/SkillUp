import User from "../models/auth.model.js";

import { ApiError } from "@skillup/common-utils";
import { constants } from "@skillup/common-utils";


export const AuthPublicService = {
   
   getUserInfo(userId) {
      return User.findById(userId).select('name email isVerified');
   },

   
   async verifyUser({ userId, userRole }) {

      const user = await User.findById(userId);

      if (!user) {
         throw new ApiError(constants.NOT_FOUND, `User not found!`);
      }

      if (user.role !== userRole) {
         throw new ApiError(constants.FORBIDDEN, `Invalid role: ${userRole}`);
      }

      return user;
   }
}