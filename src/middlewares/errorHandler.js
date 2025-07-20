import { NODE_ENV } from "../config/index.js";
import { constants } from "../constants/statusCodes.js";


export const customErrorHandler = (err, req, res, next) => {
   const statusCode = err.statusCode || 500;
   const message = err.message || 'Something went wrong';

   res.status(statusCode);

   switch (statusCode) {
      case constants.VALIDATION_ERROR:
         res.json({ success: false, title: 'Validation Error!', message });
         break;
      case constants.UNAUTHORIZED:
         res.json({ success: false, title: 'User is Unauthorized!', message });
         break;
      case constants.NOT_FOUND:
         res.json({ success: false, title: 'Not Found.', message });
         break;
      case constants.FORBIDDEN:
         res.json({ success: false, title: 'Access Denied!', message });
         break;
      default: // includes SERVER_ERROR or unexpected codes
         res.json({
            success: false,
            title: 'Server Error!',
            message,
            ...(NODE_ENV === 'development' && { stack: err.stack }),
         });
         break;
   }
}