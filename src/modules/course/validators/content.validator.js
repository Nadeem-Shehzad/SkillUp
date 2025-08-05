import { body } from "express-validator";


export const contentValidator = [
   body('title')
      .exists({ checkFalsy: true }).withMessage('title is required.')
      .trim()
      .isLength({ min: 3 }).withMessage('min 3 chars required.')
      .isLength({ max: 18 }).withMessage('max 18 chars allowed.')
      .matches(/^[a-zA-Z\s]+$/)
      .withMessage('title must contain only letters.'),

   body('duration')
      .exists({ checkFalsy: true }).withMessage('duration is required.')
      .trim()
      .isString().withMessage('duration must be string')
      .isLength({ max: 5 }).withMessage('max 5 chars allowed.'),

   body('isFree')
      .optional()
      .isBoolean().withMessage('isFree must be a boolean value'),

   body('order')
      .optional()
      .isInt({ min: 0 }).withMessage('order must be a non-negative integer'),
];


export const updateContentValidator = [
   body('title')
      .optional()
      .trim()
      .isLength({ min: 3 }).withMessage('min 3 chars required.')
      .isLength({ max: 18 }).withMessage('max 18 chars allowed.'),

   body('duration')
      .optional()
      .trim()
      .isString().withMessage('duration must be string')
      .isLength({ max: 5 }).withMessage('max 5 chars allowed.'),

   body('isFree')
      .optional()
      .isBoolean().withMessage('isFree must be a boolean value'),

   body('order')
      .optional()
      .isInt({ min: 0 }).withMessage('order must be a non-negative integer'),
];