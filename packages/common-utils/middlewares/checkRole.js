import ApiError from "../apiError.js";
import { constants } from "../statusCodes.js";


export const checkRole = (...allowedRoles) => {
   return async (req, res, next) => {
      if (!req.user) {
         throw new ApiError(constants.FORBIDDEN, 'User not Found!');
      }

      if (!allowedRoles.includes(req.user.role)) {
         throw new ApiError(constants.FORBIDDEN, `Acces Denied. only allow --> ${allowedRoles}`);
      }

      next();
   }
}