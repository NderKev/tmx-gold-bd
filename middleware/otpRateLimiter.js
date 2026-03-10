// middlewares/otpRateLimiters.js
const rateLimit = require('express-rate-limit');
const { ipKeyGenerator } = require('express-rate-limit');

// ⏱ Limit resend OTP requests to 3 per 30 minutes per IP/email
const resendOtpLimiter = rateLimit({
  windowMs: 30 * 60 * 1000, // 30 minutes
  max: 3,                   // limit to 3 requests per window
  message: (req, res) => {
    // Calculate when the lockout expires
    const retryAfter = Math.ceil(res.getHeader('Retry-After') || (30 * 60));
    const lockedUntil = new Date(Date.now() + retryAfter * 1000);
    return {
      status: 429,
      message: "Too many OTP requests. Please wait before trying again.",
      data: {
        locked_until: lockedUntil.toISOString(),
        retry_after: retryAfter
      }
    };
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    const ip = ipKeyGenerator(req); // IPv4 & IPv6 safe
    const email = req.body?.email || req.query?.email || 'unknown';
    return `${ip}-${email}`;
  },
  // Ensure the rate limit info is available in the response
  handler: (req, res, next, options) => {
    const retryAfter = options.windowMs / 1000;
    const lockedUntil = new Date(Date.now() + options.windowMs);
    res.status(options.statusCode).send({
      status: options.statusCode,
      message: options.message,
      data: {
        locked_until: lockedUntil.toISOString(),
        retry_after: retryAfter
      }
    });
  }
});

module.exports = { resendOtpLimiter };
