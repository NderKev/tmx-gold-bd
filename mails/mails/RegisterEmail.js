const Button = require('../components/Button');
const ContentBlock = require('../components/ContentBlock');
const Text = require('../components/Text');

const RegisterMailContent = (link) => `
  <div style="
      background: linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%);
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
          `<h1 style="color:#e91e63; margin-bottom: 20px;">
            Welcome to TMX GoldCoin!
          </h1>`
        )}`
      )}
      ${ContentBlock(
        `${Text(
          `<p style="font-size:16px; line-height:1.6; color:#555;">
            Thank you for registering to our service.  
            Your email has been successfully added to our system.  
            Access our platform instantly using the magic link below:
          </p>`
        )}`
      )}
      <div style="margin: 30px 0;">
        ${Button(
          'Access Now!',
          link,
          'background:#e91e63;color:#ffffff;padding:14px 28px;border-radius:8px;text-decoration:none;font-weight:bold;display:inline-block;'
        )}
      </div>
      ${ContentBlock(
        `${Text(
          `<p style="font-size:14px; color:#777; line-height:1.6;">
            Start exploring and purchase <b>TMX Gold Coin</b> tokens directly on our platform!
          </p>`
        )}`
      )}
      ${ContentBlock(
        `${Text(
          '<p style="font-size:12px; color:#aaa; margin-top:20px;">For your security, this link will expire in 30 minutes.</p>'
        )}`
      )}
    </div>
  </div>
`;

module.exports = RegisterMailContent;

