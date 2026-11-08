import express from 'express';
import { requestOTP, verifyOTP } from '../controllers/otpController.js';

const router = express.Router();

/**
 * @openapi
 * /api/otp/send:
 *   post:
 *     summary: Send Twilio OTP verification code to mobile number
 *     tags: [Verification]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - phoneNumber
 *             properties:
 *               phoneNumber:
 *                 type: string
 *                 example: "+919876543210"
 *     responses:
 *       200:
 *         description: OTP dispatched successfully
 */
router.post('/send', requestOTP);

/**
 * @openapi
 * /api/otp/verify:
 *   post:
 *     summary: Verify 6-digit OTP code
 *     tags: [Verification]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - phoneNumber
 *               - code
 *             properties:
 *               phoneNumber:
 *                 type: string
 *                 example: "+919876543210"
 *               code:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Phone number verified successfully
 */
router.post('/verify', verifyOTP);

export default router;

