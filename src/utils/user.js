import { constants } from "../constants/statusCodes.js";
import User from "../modules/auth/models/auth.model.js"
import ApiError from "./apiError.js";


export const verifyUser = async ({ userId, userRole }) => {

   const user = await User.findById(userId);

   if (!user) {
      throw new ApiError(constants.NOT_FOUND, `User not found!`);
   }

   if (user.role !== userRole) {
      throw new ApiError(constants.FORBIDDEN, `Invalid role: ${userRole}`);
   }

   return user;
}