const ContentBlock = require('../components/ContentBlock');
const Text = require('../components/Text');

const ResetPasswordEmailContent = (otp) => `
  <div style="
      background: linear-gradient(135deg, #d4fc79 0%, #96e6a1 100%);
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
          `<h1 style="color:#2e7d32; margin-bottom: 20px;">
            Reset Your TMX GoldCoin Password ✔
          </h1>`
        )}`
      )}
      ${ContentBlock(
        `${Text(
          `<p style="font-size:16px; line-height:1.6; color:#555;">
            We received a request to reset your TMX GoldCoin account password.  
          </p>`
        )}`
      )}
      
      ${ContentBlock(
        `${Text(
          `<p style="font-size:16px; line-height:1.6; color:#555;">
            Enter the OTP below to reset your password:
          </p>`
        )}`
      )}
      
      ${ContentBlock(
        `<div style="
            font-size: 28px;
            letter-spacing: 6px;
            background: #2e7d32;
            color: white;
            padding: 15px 30px;
            display: inline-block;
            border-radius: 8px;
            margin: 20px 0;
            font-weight: bold;
        ">${otp}</div>`
      )}
      
      ${ContentBlock(
        `${Text(
          `<p style="font-size:14px; color:#777; line-height:1.6;">
            If you didn’t request this, you can safely ignore this email.  
            This OTP will expire in <b>30 minutes</b> for security purposes.
          </p>`
        )}`
      )}
    </div>
  </div>
`;

module.exports = ResetPasswordEmailContent;

