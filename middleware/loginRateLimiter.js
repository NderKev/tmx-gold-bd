const rateLimit = require('express-rate-limit');
const { ipKeyGenerator } = require('express-rate-limit');

// ⏱ Allow only 3 login attempts per 30 minutes per IP
const loginLimiter = rateLimit({
  windowMs: 30 * 60 * 1000,  // 30 minutes
  max: 3,                    // 3 attempts
  standardHeaders: true,     // Return rate limit info in headers
  legacyHeaders: false,
  keyGenerator: ipKeyGenerator,  // ✅ Correct: Handles IPv6 safely
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'Too many login attempts. Try again in 30 minutes.',
    });
  },
});

module.exports = { loginLimiter };
