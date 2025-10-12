const Button = require('../components/Button');
const ContentBlock = require('../components/ContentBlock');
const Text = require('../components/Text');

const AccountLockedMailContent = (supportLink) => `
  <div style="
      background: linear-gradient(135deg, #ffe9d2 0%, #fcb69f 100%);
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
            Account Temporarily Locked
          </h1>`
        )}`
      )}
      ${ContentBlock(
        `${Text(
          `<p style="font-size:16px; line-height:1.6; color:#555;">
            Hi there,  
            your TMX GoldCoin account has been temporarily locked for your protection 
            after multiple failed login attempts.
          </p>`
        )}`
      )}
      ${ContentBlock(
        `${Text(
          `<p style="font-size:15px; color:#666;">
            For your security, you’ll need to wait <strong>30 minutes</strong> before trying again.  
            If you didn’t make these attempts, we recommend resetting your password immediately.
          </p>`
        )}`
      )}
      <div style="margin: 30px 0;">
        ${Button(
          'Contact Support',
          supportLink,
          'background:#f7931a;color:#ffffff;padding:14px 28px;border-radius:8px;text-decoration:none;font-weight:bold;display:inline-block;'
        )}
      </div>
      ${ContentBlock(
        `${Text(
          `<p style="font-size:14px; color:#777;">
            Our team is here to help you regain access safely.
          </p>`
        )}`
      )}
      ${ContentBlock(
        `${Text(
          `<p style="font-size:12px; color:#aaa; margin-top:20px;">
            TMX GoldCoin Security Team © ${new Date().getFullYear()}
          </p>`
        )}`
      )}
    </div>
  </div>
`;

module.exports = AccountLockedMailContent;
