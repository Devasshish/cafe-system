import { body, param, query, validationResult } from 'express-validator';

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
 * Validation rules for placing an order
 */
export const validateCreateOrder = [
  body('customerName')
    .trim()
    .notEmpty()
    .withMessage('Customer name is required and cannot be empty')
    .isLength({ min: 2, max: 60 })
    .withMessage('Customer name must be between 2 and 60 characters'),

  body('phoneNumber')
    .trim()
    .notEmpty()
    .withMessage('Phone number is required')
    .matches(/^\+?[0-9\s-]{7,15}$/)
    .withMessage('Please provide a valid phone number (7-15 digits)'),

  body('tableNumber')
    .notEmpty()
    .withMessage('Table number is required')
    .customSanitizer((val) => String(val).trim())
    .isLength({ min: 1, max: 20 })
    .withMessage('Table number must be between 1 and 20 characters'),

  body('items')
    .isArray({ min: 1 })
    .withMessage('Order must contain at least one item'),

  body('items.*.menuItem')
    .notEmpty()
    .withMessage('Menu item ID is required')
    .isMongoId()
    .withMessage('Invalid MenuItem ID format'),

  body('items.*.quantity')
    .notEmpty()
    .withMessage('Quantity is required')
    .isInt({ min: 1 })
    .withMessage('Quantity must be an integer of at least 1'),

  handleValidationErrors,
];

/**
 * Validation rules for updating order status
 */
export const validateUpdateOrderStatus = [
  param('id')
    .isMongoId()
    .withMessage('Invalid order ID format'),

  body('orderStatus')
    .notEmpty()
    .withMessage('orderStatus is required')
    .isIn(['Pending', 'Preparing', 'Ready', 'Completed', 'Cancelled'])
    .withMessage(
      "Invalid order status. Allowed values: 'Pending', 'Preparing', 'Ready', 'Completed', 'Cancelled'"
    ),

  handleValidationErrors,
];

/**
 * Validation rule for Order ObjectId parameter
 */
export const validateOrderIdParam = [
  param('id')
    .isMongoId()
    .withMessage('Invalid order ID format'),

  handleValidationErrors,
];

/**
 * Validation rules for GET /api/orders query params
 */
export const validateOrderQueryParams = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),

  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),

  query('status')
    .optional()
    .isIn(['Pending', 'Preparing', 'Ready', 'Completed', 'Cancelled'])
    .withMessage(
      "Invalid status filter. Allowed values: 'Pending', 'Preparing', 'Ready', 'Completed', 'Cancelled'"
    ),

  query('orderStatus')
    .optional()
    .isIn(['Pending', 'Preparing', 'Ready', 'Completed', 'Cancelled'])
    .withMessage(
      "Invalid orderStatus filter. Allowed values: 'Pending', 'Preparing', 'Ready', 'Completed', 'Cancelled'"
    ),

  query('paymentStatus')
    .optional()
    .isIn(['Unpaid', 'Paid', 'Failed'])
    .withMessage("Invalid paymentStatus. Allowed values: 'Unpaid', 'Paid', 'Failed'"),

  handleValidationErrors,
];

