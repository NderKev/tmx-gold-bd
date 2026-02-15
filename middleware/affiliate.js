const affiliateModel = require('../models/affiliateModel');

const affiliateMiddleware = async (req, res, next) => {
  const affiliateId = Number(req.query['affiliate-id'] || req.query.a || req.query.ref);
  if (!affiliateId) return next();

  // check DB quickly
  const affiliate = await affiliateModel.getAffiliateByAffiliateId(affiliateId);
  if (!affiliate) return next();

  // register click (don't await)
  const clickData = {
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    referrer: req.get('Referrer') || req.get('Referer'),
  };
  affiliateModel.incrementClick(affiliateId, clickData).catch(console.error);

  // set cookie (so subsequent signup flow knows)
  const isSecure = req.secure || process.env.NODE_ENV === 'production';
  res.cookie('affiliate_id', String(affiliateId), {
    maxAge: 30 * 24 * 60 * 60 * 1000,
    httpOnly: false,
    sameSite: 'lax',
    secure: isSecure,
  });

  // optionally rewrite URL to remove param: redirect with clean URL
  // return res.redirect(req.path); // uncomment if desired

  next();
};


module.exports = affiliateMiddleware;