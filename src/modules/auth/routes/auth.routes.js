import express from 'express';
import {
    register,
    login,
    me,
    changePassword,
    updateProfile,
    verifyEmail,
    verifyOTP,
    forgotPassword,
    resetPassword,
    refreshToken,
    logout
} from '../controllers/auth.controller.js';
import { ValidateToken } from '../../../middlewares/validateToken.js';
import { login_validator, register_validator } from '../validators/auth.validator.js';
import { validate } from '../../../middlewares/validateRequest.js';
import { authRateLimiter } from '../../../middlewares/rateLimiters.js';



const router = express.Router();

router.route('/register').post(authRateLimiter, register_validator, validate, register);
router.route('/login').post(authRateLimiter, login_validator, validate, login);

router.route('/me').get(ValidateToken, me);

router.route('/update-profile').put(ValidateToken, updateProfile);
router.route('/change-password').put(ValidateToken, changePassword);

router.route('/verify-email').post(verifyEmail);
router.route('/verify-otp').post(verifyOTP);

router.route('/refresh-token').post(refreshToken);

router.route('/logout').post(ValidateToken, logout);

router.route('/forgot-password').post(forgotPassword);
router.route('/reset-password').post(resetPassword);


export default router;