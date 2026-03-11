const rateLimit = require('express-rate-limit');
const { ipKeyGenerator } = require('express-rate-limit');

// ⏱ Allow only 3 login attempts per 10 minutes per IP
const loginLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,  // 10 minutes
  max: 3,                    // 3 attempts
  standardHeaders: true,     // Return rate limit info in headers
  legacyHeaders: false,
  keyGenerator: ipKeyGenerator,  // ✅ Correct: Handles IPv6 safely
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'Too many login attempts. Try again in 10 minutes.',
    });
  },
});

module.exports = { loginLimiter };
