// utils/ApiError.js
export default class ApiError extends Error {
   constructor(statusCode, message) {
      super(message);
      this.statusCode = statusCode;
      Error.captureStackTrace(this, this.constructor);
   }
}


// custom error function
export const errorMsg = (errors) => {
   const fieldName = errors.array()[0].path;
   const errorMsg = errors.array()[0].msg;
   const error = `${fieldName}: ${errorMsg}`;

   return error;
}