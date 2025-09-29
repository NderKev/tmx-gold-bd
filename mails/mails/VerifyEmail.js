const ContentBlock = require('../components/ContentBlock');
const Text = require('../components/Text');

const VerifyMailContent = (otp) => `
  <div style="
      background: linear-gradient(135deg, #f6d365 0%, #fda085 100%);
      padding: 40px 20px;
      font-family: Arial, Helvetica, sans-serif;
      text-align: center;
      color: #333;
  ">
    <div style="
        max-width: 600px;
        margin: auto;
        background: #ffffff;
        padding: 30px;
        border-radius: 12px;
        box-shadow: 0 4px 10px rgba(0,0,0,0.1);
    ">
      ${ContentBlock(
        `${Text(
          '<h1 style="color:#f7931a; margin-bottom: 20px;">Verify Your GoldCoin Account Email!</h1>'
        )}`
      )}
      ${ContentBlock(
        `${Text(
          `<p style="font-size:16px; line-height:1.6; color:#555;">
            You've successfully created a <b>tmxgoldcoin</b> account using this email.
            Enter the OTP below to verify your email.
          </p>
          <div style="
              font-size: 28px;
              letter-spacing: 6px;
              background: #f7931a;
              color: white;
              padding: 15px 30px;
              display: inline-block;
              border-radius: 8px;
              margin-top: 20px;
              font-weight: bold;
          ">${otp}</div>`
        )}`
      )}
      ${ContentBlock(
        `${Text(
          '<p style="font-size:14px; color:#888; margin-top:30px;">This OTP will expire in 30 minutes.</p>'
        )}`
      )}
    </div>
  </div>
`;

module.exports = VerifyMailContent;
