const db = require('../models/db');

async function generateUniqueReferralId() {
  let id;
  let exists = true;

  // keep generating until unique
  while (exists) {
    id = Math.floor(100000000 + Math.random() * 900000000); // 9-digit number
    const found = await db.read.select('*').from('users').where({ referral_id: id }).first();
    exists = !!found;
  }

  return id;
}

module.exports = { generateUniqueReferralId };
