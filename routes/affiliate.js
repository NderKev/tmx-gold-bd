const express = require('express');
const router = express.Router();
const affiliateController = require('../controllers/affiliateController');
const userController = require('../controllers/users');
const {authenticator, allowAdmin} = require('../lib/common');
const { assignReferralIdToUser } = require('../services/affiliateService');

router.post('/create', authenticator, affiliateController.createAffiliateHandler); // auth-protected
router.get('/track', affiliateController.trackAffiliate); // endpoint to hit on 

router.get("/conversions", authenticator, allowAdmin, affiliateController.getAllAffiliateConversions);

// Get stats for specific affiliate
router.get("/stats/:affiliateId", authenticator, affiliateController.getAffiliateStats);

// Get top performing affiliates
router.get("/top", authenticator,  affiliateController.getTopAffiliates);
router.post('/generate-referral/:userId', authenticator, async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await assignReferralIdToUser(userId);
    res.json({ success: true, ...result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
});
router.get('/referral/:userId', authenticator, userController.getReferralLink);

module.exports = router;
