import rateLimit from "express-rate-limit";



export const globalRateLimiter = rateLimit({
   windowMs: 15 * 60 * 1000,
   max: 100,
   message: {
      success: false,
      message: "Too many requests, please Try again in 15 minutes."
   },
   skip: (req) => {
      return ['/api/auth/register', '/api/auth/login'].includes(req.path);
   }
});


export const authRateLimiter = rateLimit({
   windowMs: 10 * 60 * 1000,
   max: 20,
   message: {
      success: false,
      message: "Too many login attempts. Try again in 10 minutes."
   }
}); 