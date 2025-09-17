const dotenv = require('dotenv');
//dotenv.config({ path: '../../.env'});
dotenv.config({ path: './.env'});
//Load env vars if env is not production

/** if (process.env.NODE_ENV !== 'production') {
  dotenv.config({ path: './env'});
}

if (process.env.NODE_ENV === 'production') {
  dotenv.config({ path: './production.env'});
} **/

module.exports = {
    SMTP_HOST: process.env.SMTP_HOST,
    SMTP_PORT: process.env.SMTP_PORT,
    SMTP_USER: process.env.SMTP_USER,
    SMTP_PW: process.env.SMTP_PW,
    INITIAL_BAL: 0,
    FROM_NAME: 'Verification',
    FROM_EMAIL: process.env.SMTP_USER,
    SUPPORT_USER: process.env.SUPPORT_USER,
    SUPPORT_PW: process.env.SUPPORT_PW,
    SUPPORT_EMAIL: process.env.SUPPORT_USER,
    SUPPORT_NAME: 'Support',
    ETH_ADDRESS : process.env.ETH_ADDRESS,
    BTC_ADDRESS : process.env.BTC_ADDRESS,
    TMX_GOLD_ADDRESS : process.env.TMX_GOLD_ADDRESS,
    INFURA_KEY : process.env.INFURA_KEY,
}