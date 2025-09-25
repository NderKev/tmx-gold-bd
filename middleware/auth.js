
const dotenv = require('dotenv');
//dotenv.config({ path: '../../.env'});
dotenv.config({ path: '../.env'});
const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  const token = req.header('authorization');

  if (!token) return res.status(401).json({ msg: 'Unauthorized request!' });
  
  try {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        res.status(401).json({ msg: 'Unauthorized request!' });
        console.error(err);
      } else {
        /** const role = decoded.data.role;
        if (role !== "null" && role !== "buyer"){
           return res.status(401).json({ msg: 'Only Buyer Allowed!' });
        } **/
        req.user = decoded.data;
        req.user.token = token;
        next();
      }
    });
  } catch (err) {
    console.error('Internal auth error in user token validation middleware');
    res.status(500).json({ msg: 'Internal auth error user' });
  }
};


module.exports = auth;