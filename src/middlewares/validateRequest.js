import { validationResult } from 'express-validator';
import { constants } from '../constants/statusCodes.js';


export const validate = (req, res, next) => {

   const errors = validationResult(req);

   if (!errors.isEmpty()) {
      return res.status(constants.VALIDATION_ERROR).json({
         success: false,
         message: errors.array()[0].msg,
      });
   }

   next();
}