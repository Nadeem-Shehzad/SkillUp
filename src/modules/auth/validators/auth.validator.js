import { body } from "express-validator";


export const register_validator = [
   body('name')
      .notEmpty().withMessage('Name Required.')
      .trim()
      .isLength({ min: 2 }).withMessage('Min 2 chars required!')
      .isLength({ max: 18 }).withMessage('Max 18 chars allowed!')
      .matches(/^[a-zA-Z\s]+$/)
      .withMessage('Name must contain only letters'),

   body('email')
      .notEmpty().withMessage('Email Required.')
      .isEmail().withMessage('Invalid Email'),

   body('password')
      .notEmpty().withMessage('Password Required.') 
      .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
      .isLength({max: 18}).withMessage('Password maximum length 18 characters allowed'),
];


export const login_validator = [
   body('email')
      .isEmail().withMessage('Invalid Email'),

   body('password')
      .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];
