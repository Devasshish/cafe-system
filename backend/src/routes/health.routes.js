import express from 'express';
import mongoose from 'mongoose';

const router = express.Router();

const getDatabaseStatus = () => {
  switch (mongoose.connection.readyState) {
    case 1:
      return 'connected';
    case 2:
      return 'connecting';
    case 3:
      return 'disconnecting';
    default:
      return 'disconnected';
  }
};

/**
 * @openapi
 * /api/health:
 *   get:
 *     summary: System health check
 *     description: Returns operational status of the backend API and database connection
 *     responses:
 *       200:
 *         description: API is running
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: OK
 *                 service:
 *                   type: string
 *                   example: Cafe Ordering System API
 *                 database:
 *                   type: object
 *                   properties:
 *                     status:
 *                       type: string
 *                       example: connected
 *                     ready:
 *                       type: boolean
 *                       example: true
 *                 timestamp:
 *                   type: string
 *                   example: 2026-11-07T18:00:00.000Z
 */
router.get('/', (req, res) => {
  const dbStatus = getDatabaseStatus();
  const isDbReady = mongoose.connection.readyState === 1;

  res.status(200).json({
    status: 'OK',
    service: 'Cafe Ordering System API',
    database: {
      status: dbStatus,
      ready: isDbReady,
    },
    timestamp: new Date().toISOString(),
  });
});

export default router;
