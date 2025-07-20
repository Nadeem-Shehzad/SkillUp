import { body } from "express-validator";


export const register_validator = [
   body('name')
      .notEmpty().withMessage('Name is ')
      .trim()
      .isLength({ min: 2 }).withMessage('Min 2 chars required!')
      .isLength({ max: 18 }).withMessage('Max 18 chars allowed!')
      .matches(/^[a-zA-Z\s]+$/)
      .withMessage('Name must contain only letters'),

   body('email')
      .isEmail().withMessage('Invalid Email'),

   body('password')
      .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];


export const login_validator = [
   body('email')
      .isEmail().withMessage('Invalid Email'),

   body('password')
      .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];
