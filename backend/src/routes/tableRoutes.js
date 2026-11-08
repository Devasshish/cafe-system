import express from 'express';
import { getTables, createTable, deleteTable } from '../controllers/tableController.js';

const router = express.Router();

/**
 * @openapi
 * /api/tables:
 *   get:
 *     summary: Retrieve all active tables
 *     tags: [Tables]
 *     responses:
 *       200:
 *         description: List of tables
 *   post:
 *     summary: Add a new table
 *     tags: [Tables]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - tableNumber
 *             properties:
 *               tableNumber:
 *                 type: string
 *                 example: "BAR-1"
 *               capacity:
 *                 type: number
 *                 example: 2
 *               section:
 *                 type: string
 *                 example: "Bar Counter"
 *     responses:
 *       201:
 *         description: Table created
 */
router.route('/')
  .get(getTables)
  .post(createTable);

/**
 * @openapi
 * /api/tables/{id}:
 *   delete:
 *     summary: Delete a table
 *     tags: [Tables]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Table deleted
 */
router.route('/:id')
  .delete(deleteTable);

export default router;

