
const dotenv = require('dotenv');
//dotenv.config({ path: '../../.env'});
dotenv.config({ path: '../.env'});
const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET;

const auth = (req, res, next) => {
  const header = req.headers['authorization'];
  if (!header) return res.status(401).json({ error: 'Missing Authorization header' });

  const [scheme, token] = header.split(' ');
  if (scheme !== 'Bearer' || !token)
    return res.status(401).json({ error: 'Invalid Authorization format' });

  jwt.verify(token, secret, (err, decoded) => {
    if (err) return res.status(401).json({ error: 'Invalid or expired token', details: err.message });
    req.user = decoded;
    next();
  });
};


module.exports = auth;