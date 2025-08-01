import { body } from "express-validator";


export const createCourseValidator = [
   body('title')
      .exists({ checkFalsy: true }).withMessage('title is required.')
      .trim()
      .isLength({ min: 3 }).withMessage('min 3 chars required.')
      .isLength({ max: 18 }).withMessage('max 18 chars allowed.')
      .matches(/^[a-zA-Z\s]+$/)
      .withMessage('title must contain only letters.'),

   body('description')
      .exists({ checkFalsy: true }).withMessage('description is required.')
      .trim()
      .isLength({ max: 50 }).withMessage('max 50 chars allowed.'),

   body('category')
      .exists({ checkFalsy: true }).withMessage('Category is required.')
      .isString().withMessage('Category must be a string')
      .isIn(['programming', 'design', 'marketing', 'business', 'photography', 'others'])
      .withMessage('Category must be one of: programming, design, marketing, business, photography, others'),

   body('level')
      .optional()
      .isIn(['beginner', 'intermediate', 'advanced'])
      .withMessage('Level must be one of: beginner, intermediate or advanced'),

   body('price')
      .exists().withMessage('price is required.')
      .bail()
      .isInt({ min: 0 }).withMessage('Price must be a non-negative integer'),

   body('discount')
      .optional()
      .isInt({ min: 0 }).withMessage('discount must be a non-negative integer'),

   body('tags')
      .optional()
      .isArray().withMessage('Tags must be an array of strings'),

   body('language')
      .optional()
      .isString().withMessage('language must be a string'),   
];



export const updateCourseValidator = [
   body('title')
      .optional()
      .trim()
      .isLength({ min: 3 }).withMessage('min 3 chars required.')
      .isLength({ max: 18 }).withMessage('max 18 chars allowed.')
      .matches(/^[a-zA-Z\s]+$/)
      .withMessage('title must contain only letters.'),

   body('description')
      .optional()
      .trim()
      .isLength({ max: 50 }).withMessage('max 50 chars allowed.'),

   body('category')
      .optional()
      .isString().withMessage('Category must be a string')
      .isIn(['programming', 'design', 'marketing', 'business', 'photography', 'others'])
      .withMessage('Category must be one of: programming, design, marketing, business, photography, others'),

   body('level')
      .optional()
      .isIn(['beginner', 'intermediate', 'advanced'])
      .withMessage('Level must be one of: beginner, intermediate or advanced'),

   body('price')
      .optional()
      .isInt({ min: 0 }).withMessage('Price must be a non-negative integer'),

   body('discount')
      .optional()
      .isInt({ min: 0 }).withMessage('discount must be a non-negative integer'),

   body('tags')
      .optional()
      .isArray().withMessage('Tags must be an array of strings')
      .isString().withMessage('tags must be  strings'),

   body('language')
      .optional()
      .isString().withMessage('language must be a string'),   
];