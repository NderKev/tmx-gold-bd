const ContentBlock = require('../components/ContentBlock');
const Text = require('../components/Text');

const PasswordResetSuccessContent = () => `
  <div style="
      background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
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
          `<h1 style="color:#4caf50; margin-bottom: 20px;">
            Password Reset Successful
          </h1>`
        )}`
      )}
      ${ContentBlock(
        `${Text(
          `<p style="font-size:16px; line-height:1.6; color:#555;">
            Your <b>TMX GoldCoin</b> account password has been successfully updated.  
            You can now log in using your new password.
          </p>`
        )}`
      )}
      ${ContentBlock(
        `${Text(
          `<p style="font-size:14px; color:#777; line-height:1.6;">
            If you did not perform this action, please <b>secure your account immediately</b> by contacting our support team.
          </p>`
        )}`
      )}
      ${ContentBlock(
        `${Text(
          '<p style="font-size:12px; color:#aaa; margin-top:30px;">For your security, never share your password or recovery codes with anyone.</p>'
        )}`
      )}
    </div>
  </div>
`;

module.exports = PasswordResetSuccessContent;
