// controllers/affiliateController.js
const affiliateModel = require('../models/affiliateModel');

const createAffiliateHandler = async (req, res) => {
  try {
    // Optionally require authenticated user: req.user.id
    const owner_user_id = req.user?.password || null;
    const { name, source, meta } = req.body;
    const affiliate = await affiliateModel.createAffiliate({ owner_user_id, name, source, meta });
    return res.json({
      success: true,
      affiliate_id: affiliate.affiliate_id,
      link: `https://www.tmxgoldcoin.co/?affiliate-id=${affiliate.affiliate_id}`
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Failed to create affiliate' });
  }
};

// Track route should be called when someone arrives to the site with affiliate-id.
// Set cookie, increment clicks, then redirect to landing page.
const trackAffiliate = async (req, res) => {
  try {
    const affiliateId = Number(req.query['affiliate-id'] || req.query.a || req.query.ref);
    if (!affiliateId) {
      return res.redirect('/'); // no id - go to home
    }

    const affiliate = await affiliateModel.getAffiliateByAffiliateId(affiliateId);
    if (!affiliate) return res.redirect('/');

    // record click (async best-effort)
    const clickData = {
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      referrer: req.get('Referrer') || req.get('Referer'),
      // optional geo: use middleware to fill req.geo
      country: req.geo?.country,
    };

    // increment click but do not block redirect - launch background promise
    affiliateModel.incrementClick(affiliateId, clickData).catch((e) => console.error('Click record failed', e));

    // set cookie for attribution (30 days)
    const cookieValue = String(affiliateId);
    res.cookie('affiliate_id', cookieValue, {
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      httpOnly: false,
      sameSite: 'Lax',
      secure: true,
    });

    // Optionally set localStorage via a small redirect page or serve landing page directly.
    // Redirect to homepage or a campaign landing page
    return res.redirect('/');
  } catch (err) {
    console.error(err);
    return res.redirect('/');
  }
};

const getAllAffiliateConversions = async (req, res) => {
  try {
    const conversions = await affiliateModel.getAllConversions();
    return res.status(200).json({
      success: true,
      count: conversions.length,
      data: conversions,
    });
  } catch (error) {
    console.error("Error fetching affiliate conversions:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

const getAffiliateStats = async (req, res) => {
  try {
    const { affiliateId } = req.params;
    const stats = await affiliateModel.getAffiliateStats(affiliateId);
    return res.status(200).json({ success: true, data: stats });
  } catch (error) {
    console.error("Error fetching affiliate stats:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

const getTopAffiliates = async (req, res) => {
  try {
    const topAffiliates = await affiliateModel.getTopAffiliates();
    return res.status(200).json({ success: true, data: topAffiliates });
  } catch (error) {
    console.error("Error fetching top affiliates:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = { createAffiliateHandler, trackAffiliate, getAllAffiliateConversions, getAffiliateStats, getTopAffiliates };
