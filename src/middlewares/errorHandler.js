import { NODE_ENV } from "../config/index.js";
import { constants, logger } from "@skillup/common-utils";


export const customErrorHandler = (err, req, res, next) => {
   const statusCode = err.statusCode || 500;
   const message = err.message || "Something went wrong";


   logger.error("Error Handler:", {
      message: err.message,
      stack: err.stack,
      meta: err.meta,
   });

   res.status(statusCode);

   switch (statusCode) {
      case constants.VALIDATION_ERROR:
         res.json({
            success: false,
            title: "Error: Validation Error!",
            message,
            ...(err.meta && { meta: err.meta }),
         });
         break;

      case constants.UNAUTHORIZED:
         res.json({ success: false, title: "Error: User is Unauthorized!", message });
         break;

      case constants.NOT_FOUND:
         res.json({ success: false, title: "Error: Data Not Found.", message });
         break;

      case constants.FORBIDDEN:
         res.json({ success: false, title: "Error: Access Denied!", message });
         break;

      case constants.CONFLICT:
         res.json({ success: false, title: "Error: Duplicate Data!", message });
         break;

      default:
         res.json({
            success: false,
            title: "Error: Server Error!",
            message,
            ...(NODE_ENV === "development" && { stack: err.stack }),
         });
         break;
   }
};