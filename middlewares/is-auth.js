exports.isAllowed = (req, res, next) => {
  if (!req.session.userID) {
    return res.status(401).send("You are not allowed to view this page");
  }
  return next();
};
