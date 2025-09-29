const ContentBlock = require('../components/ContentBlock');
const Text = require('../components/Text');
const Link = require('../components/Link');

const TransactionMailContent = (link, amount, crypto, address) => `
  <div style="
      background: linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%);
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
          `<h1 style="color:#0077ff; margin-bottom: 20px;">
            Transaction Successful
          </h1>`
        )}`
      )}
      ${ContentBlock(
        `${Text(
          `<p style="font-size:16px; line-height:1.6; color:#555;">
            Your transaction of <b>${amount} USD</b> in <b>${crypto}</b>
            has been successfully sent to the address:
            <br><span style="color:#0077ff; word-break:break-all;">${address}</span>
          </p>`
        )}`
      )}
      ${ContentBlock(
        `${Text(
          `<p style="font-size:14px; line-height:1.6; color:#777;">
            You can verify its status on the blockchain using the link below:
          </p>`
        )}`
      )}
      <div style="margin-top: 20px;">
        ${Link(
          'Verify Transaction Details',
          link,
          'background:#0077ff;color:#ffffff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold;display:inline-block;'
        )}
      </div>
      ${ContentBlock(
        `${Text(
          '<p style="font-size:13px; color:#aaa; margin-top:30px;">If you did not initiate this transaction, please contact support immediately.</p>'
        )}`
      )}
    </div>
  </div>
`;

module.exports = TransactionMailContent;
