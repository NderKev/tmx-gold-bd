const nodemailer = require('nodemailer');
require('dotenv').config({ path: './.env'});

const sendEmail = async (sendToEmail, template) => {
  const { subject, text, html } = template;

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PW,
    },
  });

  const message = {
    from: `${process.env.FROM_NAME} <${process.env.SMTP_USER}>`,
    to: sendToEmail,
    subject,
    text,
    html,
  };

  const info = await transporter.sendMail(message);

  console.log('Message sent: %s', info.messageId);
};

module.exports = sendEmail;
