const db = require('../models/db');
const { generateUniqueReferralId } = require('../utils/referral');

async function assignReferralIdToUser(userId) {
  const user = await db.read('users').where({ id: userId }).first();
  if (!user) throw new Error('User not found');

  // if already has referral_id
  if (user.referral_id) {
    return {
      referral_id: user.referral_id,
      referral_link: `https://www.goldcoin.co/?affiliate-id=${user.referral_id}`,
    };
  }

  // otherwise generate and save
  const newId = await generateUniqueReferralId();

  await db.write('users').where({ id: userId }).update({ referral_id: newId });

  // also create affiliate record for tracking (if not already exists)
  const existingAffiliate = await db.read('affiliates')
    .where({ affiliate_id: newId })
    .first();

  if (!existingAffiliate) {
    await db.write('affiliates').insert({
      affiliate_id: newId,
      owner_user_id: userId,
      created_at: db.write.fn.now(),
    });
  }

  return {
    referral_id: newId,
    referral_link: `https://www.goldcoin.co/?affiliate-id=${newId}`,
  };
}

module.exports = { assignReferralIdToUser };