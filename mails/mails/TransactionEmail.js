//const Button = require('../components/Button');
const ContentBlock = require('../components/ContentBlock');
const Text = require('../components/Text');
const Link = require('../components/Link');
//const link = `http://102.133.149.187/backend/verify/:token`
const TransactionMailContent = (link, amount, crypto, address) => `
${ContentBlock(
  `${Text(
    "Transaction of " + amount + " usd of " + crypto + "successfully sent",
)}`
)}
${ContentBlock(`
  ${Text(
  "Your transaction of " +  amount + "usd of " + crypto +" has been successfully sent to " + address + "! .",
  "\n Verify its status on blockchain from the link below.",
    )}`
  )}
${Link('Verify Transaction Details', link)}
`;

module.exports = TransactionMailContent;