const MainLayout = require('./layout/MainLayout');
const WelcomeMailContent = require('./mails/WelcomeMail');
const TransactionMailContent = require('./mails/TransactionEmail');
const VerifyMailContent = require('./mails/VerifyEmail');
const WalletMailContent = require('./mails/WalletEmail');
const ResetPasswordEmailContent = require('./mails/ResetPasswordEmail');
const RegisterMailContent = require('./mails/RegisterEmail');
const PasswordResetContent = require('./mails/PasswordResetEmail');
const DepositMailContent = require('./mails/DepositEmail'); 

const WelcomeMail = (username = '{{nickname}}', link) => ({
  id: 1,
  name: '001 | Registration Welcome',
  subject: 'Welcome to Tmxgoldcoin',
  text: ((username) =>
    `Hi ${username}!\n\nWelcome to tmxgoldcoin and thank you for registering to our service!\n\ Access now: https://www.tmxgoldcoin.co\n\nEnjoy using on our platform!\n\nThe TMX Gold  Team
    `)(username),
  html: ((username, link) =>
    `${MainLayout(
      'Welcome to TmxGoldCoin',
      username,
      WelcomeMailContent(link),
    )}`)(username, link),
});


const RegisterMail = (username = '{{nickname}}', link) => ({
  id: 2,
  name: '001 | Registration Welcome',
  subject: 'Welcome to Tmxgoldcoin',
  text: ((username) =>
    `Hi ${username}!\n\nWelcome to tmxgoldcoin and thank you for registering to our service!\n\ Access now: https://www.tmxgoldcoin.co\n\nEnjoy using on our platform!\n\nThe TMX Gold  Team
    `)(username),
  html: ((username, link) =>
    `${MainLayout(
      'Welcome to TmxGoldCoin',
      username,
      RegisterMailContent(link),
    )}`)(username, link),
});


const TransactionMail = (username, link, amount, crypto, address) => ({
  id: 3,
  name: '002 | Transaction Sent',
  subject: `${crypto} transaction sent from your wallet`,
  text: ((username, amount, crypto, address) =>
    `Hi ${username} \n\nYour transaction of ${crypto} ${amount} has been successfully sent to ${address}
    `)(username, amount, crypto, address),
  html: ((username, link, amount, crypto, address) =>
    `${MainLayout(
      `${amount} usd of ${crypto} sent from your wallet`,
      username,
      TransactionMailContent(link, amount, crypto, address),
    )}`)(username, link, amount, crypto, address),
});


const WalletMail = (username, link, crypto, address) => ({
  id: 4,
  name: '003 | Wallet created',
  subject:`A New ${crypto} Wallet Address Created`,
  text: ((username, crypto, address) =>
    `Hi ${username} \n\nA new ${crypto} wallet has been created successfully whose initial your address is ${address}
    `)(username, crypto, address),
  html: ((username, link, crypto, address) =>
    `${MainLayout(
      `${crypto} wallet address created`,
      username,
      WalletMailContent(link, crypto, address),
    )}`)(username, link, crypto, address),
});

const VerifyMail = (username = '{{nickname}}', otp) => ({
  id: 5,
  name: '004 | Verify Email',
  subject: 'Verify your Email',
  text: ((username) =>
    `Hi ${username}!\n\n Thanks for adding this email to your tmxgoldcoin account. Please follow instructions below to verify it and activate it on our platform !\n\ Access now: https://www.tmxgoldcoin.co \n\nEnjoy using on our platform!\n\nThe tmxgoldcoin Team
    `)(username),
  html: ((username, otp) =>
    `${MainLayout(
      'Verify Your Email On tmxgoldcoin ',
      username,
      VerifyMailContent(otp),
    )}`)(username, otp),
});

const ResetPasswordMail = (username = '{{nickname}}', link) => ({
  id: 6,
  name: '005 | Reset Password',
  subject: 'Reset your Password',
  text: ((username) =>
    `Hi ${username}!\n\n Please follow instructions below to reset your password for your tmxgoldcoin account. !\n\ Access now: https://www.tmxgoldcoin.co \n\nEnjoy using on our platform!\n\nThe tmxgoldcoin Team
    `)(username),
  html: ((username, link) =>
    `${MainLayout(
      'Reset Your tmxgoldcoin Account Password',
      username,
      ResetPasswordEmailContent(link),
    )}`)(username, link),
});

const PasswordResetMail = (username = '{{nickname}}') => ({
  id: 7,
  name: '006 | Password Reset',
  subject: 'Password Reset Successful',
  text: ((username) =>
    `Hi ${username}!\n\nYou've successfully reset your password!\n\ Access now: https://www.tmxgoldcoin.co\n\nEnjoy using on our platform!\n\nThe TMX Gold  Team
    `)(username),
  html: ((username) =>
    `${MainLayout(
      'Password Was Reset Successfully',
      username,
      PasswordResetContent(),
    )}`)(username),
});

const DepositMail = (username, link, amount, address) => ({
  id: 8,
  name: '007 | Tmx Gold Purchase',
  subject: `${amount} tmxgold tokens purchased successfully`,
  text: ((username, amount, address) =>
    `Hi ${username} \n\nYour have successfully purchased  ${amount} tmxgold tokens has been successfully sent to ${address}
    `)(username, amount, address),
  html: ((username, link, amount, address) =>
    `${MainLayout(
      `${amount} tmxgold  sent to your wallet`,
      username,
      DepositMailContent(link, amount, address),
    )}`)(username, link, amount, address),
});

module.exports = {
  WelcomeMail,
  RegisterMail,
  TransactionMail,
  WalletMail,
  VerifyMail,
  ResetPasswordMail,
  PasswordResetMail,
  DepositMail
};
