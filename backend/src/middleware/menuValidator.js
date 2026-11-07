import { body, param, query, validationResult } from 'express-validator';

/**
 * Middleware to check validation results and return formatted 400 response
 */
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map((err) => ({
        field: err.path,
        message: err.msg,
      })),
    });
  }
  next();
};

/**
 * Validation rules for creating a menu item
 */
export const validateCreateMenuItem = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Item name is required and cannot be empty')
    .isLength({ max: 100 })
    .withMessage('Item name cannot exceed 100 characters'),

  body('price')
    .notEmpty()
    .withMessage('Price is required')
    .isFloat({ gt: 0 })
    .withMessage('Price must be a positive number greater than 0'),

  body('category')
    .trim()
    .notEmpty()
    .withMessage('Category is required and cannot be empty')
    .isLength({ max: 50 })
    .withMessage('Category name cannot exceed 50 characters'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),

  body('image')
    .optional()
    .trim(),

  body('isAvailable')
    .optional()
    .isBoolean()
    .withMessage('isAvailable must be a boolean value'),

  body('preparationTime')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Preparation time must be a non-negative integer in minutes'),

  handleValidationErrors,
];

/**
 * Validation rules for updating a menu item
 */
export const validateUpdateMenuItem = [
  param('id')
    .isMongoId()
    .withMessage('Invalid menu item ID format'),

  body('name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Item name cannot be empty')
    .isLength({ max: 100 })
    .withMessage('Item name cannot exceed 100 characters'),

  body('price')
    .optional()
    .isFloat({ gt: 0 })
    .withMessage('Price must be a positive number greater than 0'),

  body('category')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Category cannot be empty')
    .isLength({ max: 50 })
    .withMessage('Category name cannot exceed 50 characters'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),

  body('image')
    .optional()
    .trim(),

  body('isAvailable')
    .optional()
    .isBoolean()
    .withMessage('isAvailable must be a boolean value'),

  body('preparationTime')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Preparation time must be a non-negative integer in minutes'),

  handleValidationErrors,
];

/**
 * Validation rule for MongoDB ObjectId parameter
 */
export const validateObjectIdParam = [
  param('id')
    .isMongoId()
    .withMessage('Invalid menu item ID format'),

  handleValidationErrors,
];

/**
 * Validation rules for GET /api/menu query params
 */
export const validateMenuQueryParams = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),

  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),

  query('isAvailable')
    .optional()
    .isBoolean()
    .withMessage('isAvailable filter must be a boolean (true or false)'),

  query('sort')
    .optional()
    .isIn(['price_asc', 'price_desc', 'name_asc', 'name_desc', 'newest', 'oldest'])
    .withMessage('Invalid sort option. Supported: price_asc, price_desc, name_asc, name_desc, newest, oldest'),

  handleValidationErrors,
];

