const Button = require('../components/Button');
const ContentBlock = require('../components/ContentBlock');
const Text = require('../components/Text');

const WelcomeMailContent = (link, otp) => `
  <div style="
      background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%);
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
          `<h1 style="color:#f7931a; margin-bottom: 20px;">
            Welcome to TMX GoldCoin!
          </h1>`
        )}`
      )}
      ${ContentBlock(
        `${Text(
          `<p style="font-size:16px; line-height:1.6; color:#555;">
            Thank you for registering to our service!  
            Verify your email using the OTP below or click the magic link.
          </p>`
        )}`
      )}
      ${ContentBlock(
        `${Text(
          `<div style="
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
      <div style="margin: 30px 0;">
        ${Button(
          'Verify Now!',
          link,
          'background:#f7931a;color:#ffffff;padding:14px 28px;border-radius:8px;text-decoration:none;font-weight:bold;display:inline-block;'
        )}
      </div>
      ${ContentBlock(
        `${Text(
          `<p style="font-size:14px; line-height:1.6; color:#777;">
            Enjoy selling and tracking agricultural products on our platform!
          </p>`
        )}`
      )}
      ${ContentBlock(
        `${Text(
          '<p style="font-size:12px; color:#aaa; margin-top:20px;">This OTP will expire in 10 minutes.</p>'
        )}`
      )}
    </div>
  </div>
`;

module.exports = WelcomeMailContent;

