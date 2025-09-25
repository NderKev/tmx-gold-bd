
const dotenv = require('dotenv');
//dotenv.config({ path: '../../.env'});
dotenv.config({ path: '../.env'});
const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET;

const auth = (req, res, next) =>   {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ error: 'Missing token cookie' });

  jwt.verify(token, secret, (err, decoded) => {
    if (err) return res.status(401).json({ error: 'Invalid or expired token' });
    req.user = decoded; // attach user info to the request
    next();
  });
}
  
  
  
  
  /** {
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
}; **/


module.exports = auth;