import express from 'express';
import { adminLogin, getAdminStats, getAdminCustomers } from '../controllers/adminController.js';
import { verifyAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * @openapi
 * /api/admin/login:
 *   post:
 *     summary: Admin authentication
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: admin
 *               password:
 *                 type: string
 *                 example: admin123
 *     responses:
 *       200:
 *         description: Login successful with JWT token
 *       401:
 *         description: Invalid credentials
 */
router.post('/login', adminLogin);

/**
 * @openapi
 * /api/admin/stats:
 *   get:
 *     summary: Get dashboard KPIs and metrics
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard statistics
 *       401:
 *         description: Unauthorized
 */
router.get('/stats', verifyAdmin, getAdminStats);

/**
 * @openapi
 * /api/admin/customers:
 *   get:
 *     summary: Get unique customer profiles with order counts and metrics
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Customers list retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/customers', verifyAdmin, getAdminCustomers);

export default router;

