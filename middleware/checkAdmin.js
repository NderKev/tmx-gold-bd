function checkAdmin(req, res, next) {
  if (!req.session.user || req.session.user_roles.indexOf('admin') < 0) {
    return res.status(403).send("Access denied"); 
  }
  next();
}

module.exports = checkAdmin;
