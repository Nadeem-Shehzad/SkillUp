import User from "../../models/auth.model.js";
import { ApiError, constants,logger } from "@skillup/common-utils";


export const AuthPublicService = {

   createUser({ name, email, password, role }) {
      return User.create({
         name,
         email,
         password,
         role
      });
   },

   findUser({ userId }) {
      return User.findById(userId);
   },

   async getUserInfo(userId) {
      const user = await User.findById(userId).select('name email isVerified');
      return user;
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
   },
}