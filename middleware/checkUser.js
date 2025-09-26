
function checkUser(req, res, next) {
  if (!req.session.user || req.session.user.role !== 'customer') {
    return res.status(403).send("Access denied"); 
  }
  next();
}

module.exports = checkUser;