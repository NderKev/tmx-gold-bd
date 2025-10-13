// models/affiliateModel.js
const db = require('../models/db'); // your knex instance
const crypto = require('crypto');

const generateNumericAffiliateId = async () => {
  // 9-digit numeric (100000000..999999999)
  for (let i = 0; i < 6; i++) { // retry up to 6 times
    const id = Math.floor(100000000 + Math.random() * 900000000);
    const exists = await db('affiliates').where({ affiliate_id: id }).first();
    if (!exists) return id;
  }
  // fallback to timestamp-based
  return Date.now();
};

const createAffiliate = async ({ owner_user_id = null, name = null, source = null, meta = null }) => {
  const affiliate_id = await generateNumericAffiliateId();
  const [inserted] = await db.write('affiliates')
    .insert({
      affiliate_id,
      owner_user_id,
      name,
      source,
      meta: meta ? JSON.stringify(meta) : null,
    })
    .returning(['id', 'affiliate_id', 'owner_user_id', 'name', 'source']);

  return inserted;
};

const getAffiliateByAffiliateId = async (affiliateId) => {
  return db('affiliates').where({ affiliate_id: affiliateId, active: true }).first();
};

const incrementClick = async (affiliateId, clickData = {}) => {
  await db.write.transaction(async (trx) => {
    await trx('affiliate_clicks').insert({
      affiliate_id: affiliateId,
      ip: clickData.ip,
      user_agent: clickData.userAgent,
      referrer: clickData.referrer,
      country: clickData.country || null,
    });
    await trx('affiliates').where({ affiliate_id: affiliateId }).increment('total_clicks', 1).update({ updated_at: trx.fn.now() });
  });
};

const registerConversion = async (affiliateId, { user_id = null, value = null, type = 'signup' } = {}) => {
  await db.write.transaction(async (trx) => {
    await trx('affiliate_conversions').insert({
      affiliate_id: affiliateId,
      user_id,
      value,
      type,
    });
    await trx('affiliates').where({ affiliate_id: affiliateId }).increment('total_signups', 1).update({ updated_at: trx.fn.now() });
  });
};

const getAllConversions = async () => {
  return db.read.select("affiliate_conversions as ac")
    .join("users as u", "u.id", "ac.user_id")
    .select(
      "ac.id",
      "ac.affiliate_id",
      "u.email as referred_email",
      "ac.type",
      "ac.created_at"
    )
    .orderBy("ac.created_at", "desc");
};

const getAffiliateStats = async (affiliateId) => {
  const totalConversions = await db.read.select("affiliate_conversions")
    .where("affiliate_id", affiliateId)
    .count("id as total");

  const signups = await db.read.select("affiliate_conversions")
    .where("affiliate_id", affiliateId)
    .andWhere("type", "signup")
    .count("id as total");

  return {
    affiliate_id: affiliateId,
    total_conversions: totalConversions[0].total || 0,
    signups: signups[0].total || 0,
  };
};

const getTopAffiliates = async (limit = 10) => {
  return db.read("affiliate_conversions")
    .select("affiliate_id")
    .count("id as total")
    .groupBy("affiliate_id")
    .orderBy("total", "desc")
    .limit(limit);
};

module.exports = {
  createAffiliate,
  getAffiliateByAffiliateId,
  incrementClick,
  registerConversion,
  getAllConversions,
  getAffiliateStats,
  getTopAffiliates
};
