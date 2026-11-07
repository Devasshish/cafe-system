import express from 'express';
import {
  getMenuItems,
  getMenuItemById,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
} from '../controllers/menuController.js';
import {
  validateCreateMenuItem,
  validateUpdateMenuItem,
  validateObjectIdParam,
  validateMenuQueryParams,
} from '../middleware/menuValidator.js';
import { verifyAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * @openapi
 * components:
 *   schemas:
 *     MenuItem:
 *       type: object
 *       required:
 *         - name
 *         - price
 *         - category
 *       properties:
 *         _id:
 *           type: string
 *           example: 6512bd3f89a42167d301c2e4
 *         name:
 *           type: string
 *           example: Cappuccino
 *         description:
 *           type: string
 *           example: Rich espresso topped with foamy steamed milk
 *         price:
 *           type: number
 *           example: 4.50
 *         category:
 *           type: string
 *           example: hot coffee
 *         image:
 *           type: string
 *           example: https://images.unsplash.com/photo-1572442388796-11668a67e53d
 *         isAvailable:
 *           type: boolean
 *           example: true
 *         preparationTime:
 *           type: number
 *           example: 5
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @openapi
 * /api/menu:
 *   get:
 *     summary: Get all menu items
 *     tags: [Menu]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search keyword matching item name or description
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter items by category
 *       - in: query
 *         name: isAvailable
 *         schema:
 *           type: boolean
 *         description: Filter items by availability status
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [price_asc, price_desc, name_asc, name_desc, newest, oldest]
 *         description: Sorting order
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Items per page
 *     responses:
 *       200:
 *         description: List of menu items retrieved successfully
 *   post:
 *     summary: Create a new menu item
 *     tags: [Menu]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *               - category
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               category:
 *                 type: string
 *               image:
 *                 type: string
 *               isAvailable:
 *                 type: boolean
 *               preparationTime:
 *                 type: number
 *     responses:
 *       201:
 *         description: Menu item created successfully
 *       400:
 *         description: Validation error
 *       409:
 *         description: Menu item with this name already exists
 */
router
  .route('/')
  .get(validateMenuQueryParams, getMenuItems)
  .post(verifyAdmin, validateCreateMenuItem, createMenuItem);

/**
 * @openapi
 * /api/menu/{id}:
 *   get:
 *     summary: Get single menu item by ID
 *     tags: [Menu]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the menu item
 *     responses:
 *       200:
 *         description: Menu item found
 *       404:
 *         description: Menu item not found
 *   put:
 *     summary: Update an existing menu item
 *     tags: [Menu]
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
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               category:
 *                 type: string
 *               image:
 *                 type: string
 *               isAvailable:
 *                 type: boolean
 *               preparationTime:
 *                 type: number
 *     responses:
 *       200:
 *         description: Menu item updated successfully
 *       404:
 *         description: Menu item not found
 *   delete:
 *     summary: Delete a menu item by ID
 *     tags: [Menu]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Menu item deleted successfully
 *       404:
 *         description: Menu item not found
 */
router
  .route('/:id')
  .get(validateObjectIdParam, getMenuItemById)
  .put(verifyAdmin, validateUpdateMenuItem, updateMenuItem)
  .delete(verifyAdmin, validateObjectIdParam, deleteMenuItem);

export default router;

