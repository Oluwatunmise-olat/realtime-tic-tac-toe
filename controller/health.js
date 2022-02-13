exports.ping = (req, res, next) => {
  res.status(201).json({ success: true, msg: "pong" });
};
