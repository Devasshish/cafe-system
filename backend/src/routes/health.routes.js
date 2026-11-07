import express from 'express';

const router = express.Router();

/**
 * @openapi
 * /api/health:
 *   get:
 *     summary: System health check
 *     description: Returns the operational status of the backend API
 *     responses:
 *       200:
 *         description: API is running smoothly
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: OK
 *                 message:
 *                   type: string
 *                   example: Cafe Ordering System API is running
 *                 timestamp:
 *                   type: string
 *                   example: 2026-11-07T18:00:00.000Z
 */
router.get('/', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Cafe Ordering System API is running',
    timestamp: new Date().toISOString(),
  });
});

export default router;
