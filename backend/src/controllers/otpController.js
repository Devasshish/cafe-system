import {
  sendVerificationOTP,
  checkVerificationOTP,
  normalizePhoneNumber,
} from '../services/twilioService.js';

/**
 * Controller to send OTP to mobile number
 * POST /api/otp/send
 */
export const requestOTP = async (req, res, next) => {
  try {
    const { phoneNumber } = req.body;

    if (!phoneNumber) {
      return res.status(400).json({
        success: false,
        message: 'Mobile number is required to send verification code.',
      });
    }

    const result = await sendVerificationOTP(phoneNumber);

    return res.status(200).json({
      success: true,
      data: {
        phone: result.phone,
        method: result.method,
        devCode: result.devCode,
        twilioError: result.twilioError,
      },
      message: result.message,
    });
  } catch (error) {
    console.error('requestOTP controller error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to send OTP verification code.',
    });
  }
};

/**
 * Controller to verify OTP
 * POST /api/otp/verify
 */
export const verifyOTP = async (req, res, next) => {
  try {
    const { phoneNumber, code } = req.body;

    if (!phoneNumber || !code) {
      return res.status(400).json({
        success: false,
        message: 'Both phone number and 6-digit OTP code are required.',
      });
    }

    const result = await checkVerificationOTP(phoneNumber, code);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: result.message,
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        phone: normalizePhoneNumber(phoneNumber),
        verified: true,
      },
      message: result.message,
    });
  } catch (error) {
    console.error('verifyOTP controller error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to verify OTP code.',
    });
  }
};

