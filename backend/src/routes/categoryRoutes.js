import express from 'express';
import {
  getCategories,
  createCategory,
  updateCategory,
  toggleCategory,
  deleteCategory,
} from '../controllers/categoryController.js';
import { verifyAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * @openapi
 * /api/categories:
 *   get:
 *     summary: Retrieve all active cafe menu categories
 *     tags:
 *       - Categories
 *     parameters:
 *       - in: query
 *         name: includeInactive
 *         schema:
 *           type: boolean
 *         description: Include inactive categories for admin management
 *     responses:
 *       200:
 *         description: List of categories with item counts
 *   post:
 *     summary: Create a new category
 *     tags:
 *       - Categories
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - label
 *             properties:
 *               name:
 *                 type: string
 *               label:
 *                 type: string
 *               description:
 *                 type: string
 *               order:
 *                 type: number
 *               isActive:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Category created successfully
 */
router
  .route('/')
  .get(getCategories)
  .post(verifyAdmin, createCategory);

/**
 * @openapi
 * /api/categories/{id}:
 *   put:
 *     summary: Update an existing category
 *     tags:
 *       - Categories
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Category updated successfully
 *   delete:
 *     summary: Delete a category
 *     tags:
 *       - Categories
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Category deleted successfully
 */
router
  .route('/:id')
  .put(verifyAdmin, updateCategory)
  .delete(verifyAdmin, deleteCategory);

router.route('/:id/toggle').patch(verifyAdmin, toggleCategory);

export default router;
