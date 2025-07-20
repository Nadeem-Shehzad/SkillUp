import express from 'express';
import { register, login, me, changePassword, updateProfile } from '../controllers/auth.controller.js';
import { ValidateToken } from '../../../middlewares/validateToken.js';
import { login_validator, register_validator } from '../validators/auth.validator.js';
import { validate } from '../../../middlewares/validateRequest.js';

const router = express.Router();

router.route('/register').post(register_validator, validate, register);
router.route('/login').post(login_validator, validate, login);
router.route('/me').get(ValidateToken, me);
router.route('/update-profile').put(ValidateToken, updateProfile);
router.route('/change-password').put(ValidateToken, changePassword);

export default router;