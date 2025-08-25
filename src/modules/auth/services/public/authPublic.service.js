import User from "../../models/auth.model.js";
import { ApiError, constants } from "@skillup/common-utils";


export const AuthPublicService = {

   findUser({ userId }) {
      return User.findById(userId);
   },

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
   },

   updateUser({ userId, dataToUpdate }) {
      return User.findByIdAndUpdate(userId, dataToUpdate);
   }
}