import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/index.js';
import ApiError from '../utils/apiError.js';
import { constants } from '../constants/statusCodes.js';


export const ValidateToken = async (req, res, next) => {
   let token;

   let authHeader = req.headers.Authorization || req.headers.authorization;
   if (authHeader && authHeader.startsWith('Bearer')) {
      token = authHeader.split(' ')[1];

      jwt.verify(token, JWT_SECRET, (err, decode) => {
         if (err) {
            throw new ApiError(constants.UNAUTHORIZED, 'User not Authorized');
         }

         req.user = decode.user;
         next();
      });

      if (!token) {
         throw new ApiError(constants.VALIDATION_ERROR, 'User is not authorized or token is missing!');
      }
   } else {
      throw new ApiError(constants.VALIDATION_ERROR,'Token Providing Error');
   }
}