//const Button = require('../components/Button');
const ContentBlock = require('../components/ContentBlock');
const Text = require('../components/Text');
//const link = `http://102.133.149.187/backend/verify/:token`
const VerifyMailContent = (otp) => `
${ContentBlock(
  `${Text(
    'Verify Your GoldCoin Account Email!',
  )}`,
)}
${ContentBlock(`${Text("You've successfully created a tmxgoldcoin account using this email. " +
  "Enter OTP below to verify your email. \n\n")}`)}
${Text(otp)}
`;

module.exports = VerifyMailContent;
