const Button = require('../components/Button');
//${Button('Verify now!', link)}
const ContentBlock = require('../components/ContentBlock');
const Text = require('../components/Text');
//const link = `http://102.133.149.187/backend/verify/:token`
const RegisterMailContent = (link ) => `
${ContentBlock(
  `${Text(
    'Welcome to tmxgoldcoin and thank you for registering to our service!',
  )}`,
)}
${ContentBlock(`
  ${Text(
  'Your email has been registered to our system: \n\n access our site using the magic link below',  
  )}
  `)} 
${Button('Access now!', link)}
${ContentBlock(`${Text('Purchase TMXGold Coin tokens on our platform!')}`)}
`;

module.exports = RegisterMailContent;
