// middlewares/otpRateLimiters.js
const rateLimit = require('express-rate-limit');
const { ipKeyGenerator } = require('express-rate-limit');

// ⏱ Limit resend OTP requests to 3 per 30 minutes per IP/email
const resendOtpLimiter = rateLimit({
  windowMs: 30 * 60 * 1000, // 30 minutes
  max: 3,                   // limit to 3 requests per window
  message: {
    status: 429,
    error: "Too many OTP requests. Please wait 30 minutes before trying again.",
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    const ip = ipKeyGenerator(req); // IPv4 & IPv6 safe
    const email = req.body?.email || req.query?.email || 'unknown';
    return `${ip}-${email}`;
  },
});

module.exports = { resendOtpLimiter };
