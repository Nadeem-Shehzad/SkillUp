import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/index.js';
import { ApiError, constants } from "@skillup/common-utils";
import User from '../modules/auth/models/auth.model.js';



export const ValidateToken = async (req, res, next) => {

   const token = req.headers.authorization?.split(" ")[1];

   if (!token) {
      throw new ApiError(constants.UNAUTHORIZED, "No token provided");
   }

   try {
      const decoded = jwt.verify(token, JWT_SECRET);

      const user = await User.findById(decoded.user.id);
      if (!user) {
         throw new ApiError(constants.UNAUTHORIZED, "Invalid Token");
      }

      req.user = decoded.user;
      next();
   } catch (err) {
      return res.status(401).json({ message: "Token verification failed" });
   }
}