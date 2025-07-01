
export const customErrorHandler = (err, req, res, next) => {
   const statusCode = err.statusCode || 500;

   res.status(statusCode);

   switch (statusCode) {
      case 404:
         res.json({ success: false, title: 'Not Found.', message: err.message });
         break;
      case 400:
         res.json({ success: false, title: 'Bad Request.', message: err.message });
         break;
      case 500:
         res.json({ success: false, title: 'Internal server error.', message: err.message });
         break;
      default:
         console.log('No Error, All good!');
         break;
   }
}