import twilio from 'twilio';

// In-memory OTP storage for programmable SMS or development simulation mode
// Key: normalizedPhoneNumber -> { code, expiresAt, verified, attempts }
const otpStore = new Map();

/**
 * Normalizes phone numbers to standard E.164 format (defaults to +91 for 10-digit Indian numbers)
 */
export const normalizePhoneNumber = (rawPhone) => {
  if (!rawPhone) return '';
  const cleaned = rawPhone.toString().trim().replace(/[\s\-\(\)]/g, '');

  if (cleaned.startsWith('+')) {
    return cleaned;
  }

  // 10-digit Indian mobile number
  if (/^[6-9]\d{9}$/.test(cleaned)) {
    return `+91${cleaned}`;
  }

  // 11-digit starting with 0
  if (/^0[6-9]\d{9}$/.test(cleaned)) {
    return `+91${cleaned.slice(1)}`;
  }

  return `+${cleaned}`;
};

/**
 * Checks whether valid Twilio credentials are configured
 */
export const isTwilioConfigured = () => {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;

  return (
    accountSid &&
    authToken &&
    accountSid.startsWith('AC') &&
    !accountSid.includes('your_') &&
    !authToken.includes('your_')
  );
};

/**
 * Gets initialized Twilio Client
 */
const getTwilioClient = () => {
  if (!isTwilioConfigured()) return null;
  return twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
};

/**
 * Send OTP to the customer's phone number
 */
export const sendVerificationOTP = async (rawPhone) => {
  const phone = normalizePhoneNumber(rawPhone);
  if (!phone || phone.length < 10) {
    throw new Error('Please provide a valid mobile number with country code.');
  }

  const client = getTwilioClient();
  const serviceSid = process.env.TWILIO_SERVICE_SID;
  const twilioNumber = process.env.TWILIO_PHONE_NUMBER;

  // 1. Try Twilio Verify Service (Recommended standard by Twilio)
  if (client && serviceSid && serviceSid.startsWith('VA')) {
    try {
      console.log(`[Twilio Verify] Initiating SMS verification for ${phone} with service ${serviceSid}...`);
      const verification = await client.verify.v2
        .services(serviceSid)
        .verifications.create({ to: phone, channel: 'sms' });

      console.log(`[Twilio Verify] SMS dispatched successfully. Status: ${verification.status}`);
      return {
        success: true,
        phone,
        method: 'twilio_verify',
        status: verification.status,
        message: `Verification code sent to ${phone} via Twilio SMS.`,
      };
    } catch (err) {
      console.error(`[Twilio Verify Error ${err.code}]:`, err.message);

      // Specific Twilio Trial Account Restriction
      if (err.code === 21608) {
        // Generate fallback dev code so the developer is not blocked, but explain the exact reason
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = Date.now() + 5 * 60 * 1000;
        otpStore.set(phone, { code, expiresAt, verified: false, attempts: 0 });

        console.warn(`[Twilio Trial Account Notice]: ${phone} is not a verified caller ID on your Twilio Trial account.`);
        console.warn(`Verify your number at: https://console.twilio.com/us1/develop/phone-numbers/manage/verified`);

        return {
          success: true,
          phone,
          method: 'twilio_trial_fallback',
          devCode: code,
          twilioError: 'Twilio Trial Account: This number is not verified in your Twilio console. Please verify it at twilio.com/user/account/phone-numbers/verified or use the verification code shown.',
          message: `Twilio Trial Account: Verification code for ${phone} is ${code} (Number unverified in Twilio Console).`,
        };
      }

      // Geo-permissions error
      if (err.code === 21408) {
        throw new Error(
          `Twilio Error: SMS to India (${phone}) is disabled in your Twilio Console. Please enable India under Twilio Messaging Geo-Permissions.`
        );
      }

      // Invalid Service SID or Auth error
      if (err.code === 20404 || err.code === 20003) {
        throw new Error(`Twilio Configuration Error: ${err.message}. Please check your Twilio SID and Auth Token.`);
      }

      throw new Error(`Twilio Error (${err.code}): ${err.message}`);
    }
  }

  // Generate a secure 6-digit OTP
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes validity

  otpStore.set(phone, {
    code,
    expiresAt,
    verified: false,
    attempts: 0,
  });

  // 2. Try Twilio Programmable SMS
  if (client && twilioNumber) {
    try {
      await client.messages.create({
        body: `☕ Recharge Café: Your order verification code is ${code}. Valid for 5 minutes. Please do not share this OTP.`,
        from: twilioNumber,
        to: phone,
      });

      console.log(`[Twilio SMS] Verification code sent to ${phone}`);
      return {
        success: true,
        phone,
        method: 'twilio_sms',
        message: `Verification code sent to ${phone} via Twilio SMS.`,
      };
    } catch (err) {
      console.error(`[Twilio SMS Error ${err.code}]:`, err.message);

      if (err.code === 21608) {
        return {
          success: true,
          phone,
          method: 'twilio_trial_fallback',
          devCode: code,
          twilioError: 'Twilio Trial Account: Number unverified in Twilio Console.',
          message: `Twilio Trial: Verification code for ${phone} is ${code}.`,
        };
      }

      throw new Error(`Twilio SMS Error: ${err.message}`);
    }
  }

  // 3. Fallback: Development / Simulation Mode (if credentials not provided)
  console.log('----------------------------------------------------');
  console.log(`☕ [TWILIO DEV SIMULATION] Verification OTP for ${phone}: ${code}`);
  console.log('Configure TWILIO_ACCOUNT_SID & TWILIO_AUTH_TOKEN in backend/.env for live SMS.');
  console.log('----------------------------------------------------');

  return {
    success: true,
    phone,
    method: 'simulation',
    devCode: code,
    message: `Verification code sent to ${phone} (Development Simulation).`,
  };
};

/**
 * Verify OTP entered by customer
 */
export const checkVerificationOTP = async (rawPhone, inputCode) => {
  const phone = normalizePhoneNumber(rawPhone);
  const code = (inputCode || '').toString().trim();

  if (!phone || !code) {
    return { success: false, message: 'Phone number and verification code are required.' };
  }

  const client = getTwilioClient();
  const serviceSid = process.env.TWILIO_SERVICE_SID;

  // 1. Verify via Twilio Verify Service if active
  if (client && serviceSid && serviceSid.startsWith('VA')) {
    try {
      const check = await client.verify.v2
        .services(serviceSid)
        .verificationChecks.create({ to: phone, code });

      if (check.status === 'approved') {
        otpStore.set(phone, { verified: true, verifiedAt: Date.now() });
        return { success: true, message: 'Phone number verified successfully via Twilio!' };
      }
    } catch (err) {
      console.error('Twilio Verify check error:', err.message);
      // If code was not found in Twilio (e.g. expired or fallback used), check in-memory store below
    }
  }

  // 2. Verify via in-memory store (for SMS or Trial fallback / Simulation mode)
  const inMemoryEntry = otpStore.get(phone);
  if (!inMemoryEntry) {
    return {
      success: false,
      message: 'No active verification code found for this number. Please request a new OTP.',
    };
  }

  if (Date.now() > inMemoryEntry.expiresAt) {
    otpStore.delete(phone);
    return { success: false, message: 'Verification code has expired. Please request a new OTP.' };
  }

  if (inMemoryEntry.attempts >= 4) {
    otpStore.delete(phone);
    return { success: false, message: 'Too many incorrect attempts. Please request a new OTP.' };
  }

  if (inMemoryEntry.code !== code) {
    inMemoryEntry.attempts += 1;
    return { success: false, message: 'Incorrect verification code. Please check and try again.' };
  }

  // Code matched!
  otpStore.set(phone, { verified: true, verifiedAt: Date.now() });

  return {
    success: true,
    message: 'Mobile number verified successfully!',
  };
};

/**
 * Checks if a phone number was recently verified
 */
export const isPhoneVerified = (rawPhone) => {
  const phone = normalizePhoneNumber(rawPhone);
  const record = otpStore.get(phone);
  if (!record || !record.verified) return false;

  // Valid for 15 minutes after verification
  return Date.now() - (record.verifiedAt || 0) < 15 * 60 * 1000;
};
