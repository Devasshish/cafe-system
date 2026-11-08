import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { ShieldCheck, MessageSquare, ArrowLeft, RefreshCw, Loader2, CheckCircle2 } from 'lucide-react';
import api from '../services/api';

const OtpVerificationModal = ({
  phoneNumber,
  devCodeHint,
  onVerified,
  onClose,
  isPlacingOrder,
}) => {
  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);
  const [activeDevCode, setActiveDevCode] = useState(devCodeHint);

  const inputRefs = useRef([]);

  // Auto focus first input on mount
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  // 30-second countdown for resend
  useEffect(() => {
    if (resendTimer <= 0) return;
    const interval = setInterval(() => {
      setResendTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleChange = (index, value) => {
    // Only accept numbers
    const cleanVal = value.replace(/\D/g, '').slice(-1);
    const newDigits = [...digits];
    newDigits[index] = cleanVal;
    setDigits(newDigits);
    setError(null);

    // Auto move to next input
    if (cleanVal && index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus();
    }

    // Auto submit if all 6 digits entered
    if (cleanVal && index === 5 && newDigits.every((d) => d !== '')) {
      handleVerify(newDigits.join(''));
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasted) return;

    const newDigits = [...digits];
    for (let i = 0; i < 6; i++) {
      newDigits[i] = pasted[i] || '';
    }
    setDigits(newDigits);

    if (pasted.length === 6) {
      handleVerify(pasted);
    } else {
      inputRefs.current[Math.min(pasted.length, 5)]?.focus();
    }
  };

  const handleVerify = async (codeToVerify) => {
    const code = codeToVerify || digits.join('');
    if (code.length < 6) {
      setError('Please enter all 6 digits of the verification code.');
      return;
    }

    setIsVerifying(true);
    setError(null);

    try {
      const res = await api.post('/otp/verify', {
        phoneNumber,
        code,
      });

      if (res.data && res.data.success) {
        onVerified(code);
      } else {
        setError(res.data?.message || 'Invalid code. Please try again.');
      }
    } catch (err) {
      console.error('OTP verification failed:', err);
      setError(
        err.response?.data?.message || 'Incorrect verification code. Please check and try again.'
      );
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    if (resendTimer > 0 || isResending) return;

    setIsResending(true);
    setError(null);

    try {
      const res = await api.post('/otp/send', { phoneNumber });
      if (res.data && res.data.success) {
        setResendTimer(30);
        if (res.data.data?.devCode) {
          setActiveDevCode(res.data.data.devCode);
        }
      }
    } catch (err) {
      console.error('Resend OTP error:', err);
      setError(err.response?.data?.message || 'Failed to resend code. Please try again later.');
    } finally {
      setIsResending(false);
    }
  };

  const fillDevCode = () => {
    if (!activeDevCode) return;
    const split = activeDevCode.split('').slice(0, 6);
    setDigits(split);
    handleVerify(activeDevCode);
  };

  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#FAF6F0] border border-[#E8DCCF] rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative">
        {/* Top Header */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={onClose}
            type="button"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#7D5F4C] hover:text-[#2E1C14] transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Change Number</span>
          </button>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#B23B14]/10 text-[#B23B14]">
            <ShieldCheck className="w-3.5 h-3.5" />
            SMS Verification
          </span>
        </div>

        {/* Icon & Title */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-[#B23B14]/10 text-[#B23B14] flex items-center justify-center mx-auto mb-3 shadow-inner">
            <MessageSquare className="w-7 h-7 text-[#B23B14]" />
          </div>
          <h3 className="font-serif font-black text-2xl text-[#331B0F] tracking-tight">
            Verify Mobile Number
          </h3>
          <p className="text-xs text-[#7D5F4C] mt-1 max-w-xs mx-auto">
            We sent a 6-digit SMS verification code to
          </p>
          <p className="font-mono font-bold text-sm text-[#331B0F] mt-0.5 tracking-wider">
            {phoneNumber}
          </p>
        </div>

        {/* Simulation / Dev Mode Helper Pill */}
        {activeDevCode && (
          <div className="mb-5 p-3 rounded-xl bg-amber-50 border border-amber-200 text-center">
            <p className="text-[11px] text-amber-900 font-medium">
              💡 <span className="font-bold">Dev Verification Code:</span>{' '}
              <strong className="font-mono text-xs text-amber-950 font-black">{activeDevCode}</strong>
            </p>
            <button
              onClick={fillDevCode}
              type="button"
              className="mt-1 text-[11px] font-bold text-[#B23B14] hover:underline cursor-pointer"
            >
              Auto-fill code & verify
            </button>
          </div>
        )}

        {/* 6 Digit Input Boxes */}
        <div className="flex justify-center gap-2 sm:gap-3 mb-4" onPaste={handlePaste}>
          {digits.map((digit, idx) => (
            <input
              key={idx}
              ref={(el) => (inputRefs.current[idx] = el)}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(idx, e.target.value)}
              onKeyDown={(e) => handleKeyDown(idx, e)}
              className={`w-11 h-13 sm:w-12 sm:h-14 text-center font-mono font-black text-xl rounded-xl bg-white border transition shadow-sm focus:outline-none focus:ring-2 focus:ring-[#B23B14] ${
                error
                  ? 'border-rose-400 bg-rose-50/50 text-rose-900'
                  : digit
                  ? 'border-[#B23B14] text-[#331B0F]'
                  : 'border-[#E2D5C7] text-[#331B0F]'
              }`}
            />
          ))}
        </div>

        {/* Error message */}
        {error && (
          <p className="text-center text-xs font-semibold text-rose-600 mb-4 animate-shake">
            {error}
          </p>
        )}

        {/* Verify Action Button */}
        <button
          onClick={() => handleVerify()}
          disabled={isVerifying || isPlacingOrder || digits.some((d) => !d)}
          type="button"
          className="w-full py-3.5 px-4 rounded-xl bg-[#B23B14] hover:bg-[#962e0b] active:scale-[0.99] text-white font-bold text-sm transition-all shadow-md shadow-[#B23B14]/25 disabled:bg-[#D8C7B8] disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
        >
          {isVerifying || isPlacingOrder ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Verifying & Confirming Order...</span>
            </>
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4" />
              <span>Verify & Place Order</span>
            </>
          )}
        </button>

        {/* Resend Section */}
        <div className="text-center mt-4">
          {resendTimer > 0 ? (
            <p className="text-xs text-[#8C7A6B]">
              Resend code in <span className="font-mono font-bold text-[#331B0F]">{resendTimer}s</span>
            </p>
          ) : (
            <button
              onClick={handleResend}
              disabled={isResending}
              type="button"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#B23B14] hover:underline cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isResending ? 'animate-spin' : ''}`} />
              <span>Resend Verification Code</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );

  if (typeof document === 'undefined') {
    return modalContent;
  }

  return createPortal(modalContent, document.body);
};

export default OtpVerificationModal;

