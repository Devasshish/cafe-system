import express from 'express';
import {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
} from '../controllers/orderController.js';
import {
  validateCreateOrder,
  validateUpdateOrderStatus,
  validateOrderIdParam,
  validateOrderQueryParams,
} from '../middleware/orderValidator.js';

const router = express.Router();

/**
 * @openapi
 * components:
 *   schemas:
 *     OrderItemSnapshot:
 *       type: object
 *       properties:
 *         menuItem:
 *           type: string
 *           example: 6512bd3f89a42167d301c2e4
 *         name:
 *           type: string
 *           example: Caramel Macchiato
 *         price:
 *           type: number
 *           example: 4.75
 *         quantity:
 *           type: integer
 *           example: 2
 *     Order:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 6512be5f89a42167d301c2e9
 *         orderNumber:
 *           type: string
 *           example: ORD-261108-4821
 *         customerName:
 *           type: string
 *           example: John Doe
 *         phoneNumber:
 *           type: string
 *           example: "+1-555-0199"
 *         tableNumber:
 *           type: string
 *           example: "5"
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/OrderItemSnapshot'
 *         subtotal:
 *           type: number
 *           example: 9.50
 *         totalAmount:
 *           type: number
 *           example: 9.50
 *         orderStatus:
 *           type: string
 *           enum: [Pending, Preparing, Ready, Completed, Cancelled]
 *           example: Pending
 *         paymentStatus:
 *           type: string
 *           enum: [Unpaid, Paid, Failed]
 *           example: Unpaid
 *         createdAt:
 *           type: string
 *           format: date-time
 */

/**
 * @openapi
 * /api/orders:
 *   post:
 *     summary: Place a new order
 *     tags: [Orders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - customerName
 *               - phoneNumber
 *               - tableNumber
 *               - items
 *             properties:
 *               customerName:
 *                 type: string
 *                 example: John Doe
 *               phoneNumber:
 *                 type: string
 *                 example: "+1-555-0199"
 *               tableNumber:
 *                 type: string
 *                 example: "12"
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - menuItem
 *                     - quantity
 *                   properties:
 *                     menuItem:
 *                       type: string
 *                       example: 6aef713418ff236491dcc7b5
 *                     quantity:
 *                       type: integer
 *                       example: 2
 *     responses:
 *       201:
 *         description: Order created successfully
 *       400:
 *         description: Validation error or unavailable menu item
 *   get:
 *     summary: Get all orders with status filtering & pagination
 *     tags: [Orders]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [Pending, Preparing, Ready, Completed, Cancelled]
 *       - in: query
 *         name: tableNumber
 *         schema:
 *           type: string
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Orders list retrieved successfully
 */
router
  .route('/')
  .post(validateCreateOrder, createOrder)
  .get(validateOrderQueryParams, getOrders);

/**
 * @openapi
 * /api/orders/{id}:
 *   get:
 *     summary: Get single order by ID
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Order found
 *       404:
 *         description: Order not found
 */
router.route('/:id').get(validateOrderIdParam, getOrderById);

/**
 * @openapi
 * /api/orders/{id}/status:
 *   patch:
 *     summary: Update order status
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - orderStatus
 *             properties:
 *               orderStatus:
 *                 type: string
 *                 enum: [Pending, Preparing, Ready, Completed, Cancelled]
 *               paymentStatus:
 *                 type: string
 *                 enum: [Unpaid, Paid, Failed]
 *     responses:
 *       200:
 *         description: Order status updated successfully
 *       400:
 *         description: Invalid status value
 *       404:
 *         description: Order not found
 */
router.route('/:id/status').patch(validateUpdateOrderStatus, updateOrderStatus);

export default router;

