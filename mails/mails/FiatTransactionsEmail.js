const ContentBlock = require('../components/ContentBlock');
const Text = require('../components/Text');
//const Link = require('../components/Link');

const FiatTransactionMailContent = (ref_no, mode , fiat, amount, amount_usd) => `
  <div style="
      background: linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%);
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
          `<h1 style="color:#2196f3; margin-bottom: 20px;">
            Purchase Successful
          </h1>`
        )}`
      )}
      ${ContentBlock(
        `${Text(
          `<p style="font-size:16px; line-height:1.6; color:#555;">
            Your purchase of <b>${amount} TMX Gold Coin </b> 
             via ${mode} in ${fiat} equivalent 
             worth  of $ ${amount_usd} has been successfully deposited your wallet.
             The Reference Number of the transaction below:
          </p>
          <div style="
              word-break: break-all;
              background: #f5f5f5;
              color: #2196f3;
              padding: 12px 16px;
              border-radius: 8px;
              margin: 20px auto;
              display: inline-block;
              font-size: 15px;
              font-weight: bold;
          ">${ref_no}</div>
          <p style="font-size:14px; line-height:1.6; color:#777; margin-top:10px;">
            You can verify its status on the blockchain using the link below.
          </p>`
        )}`
      )}
      ${ContentBlock(
        `${Text(
          '<p style="font-size:12px; color:#aaa; margin-top:30px;">For security, always double-check the payment details before making further transactions.</p>'
        )}`
      )}
    </div>
  </div>
`;

module.exports = FiatTransactionMailContent;