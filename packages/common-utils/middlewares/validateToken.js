import jwt from 'jsonwebtoken';
import { ApiError, constants } from "@skillup/common-utils";



export const ValidateToken = async (req, res, next) => {

   const token = req.headers.authorization?.split(" ")[1];

   if (!token) {
      throw new ApiError(constants.UNAUTHORIZED, "No token provided");
   }

   try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded.user;

      next();

   } catch (err) {
      return res.status(401).json({ message: "Token verification failed" });
   }
}