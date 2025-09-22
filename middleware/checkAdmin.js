function checkAdmin(req, res, next) {
  if (!req.session.user || req.session.user.role !== 'admin') {
    return res.status(403).send("Access denied"); 
  }
  next();
}

module.exports = checkAdmin;
