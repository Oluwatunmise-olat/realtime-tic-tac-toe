const mongoose = require("mongoose");

module.exports = async (cb) => {
  try {
    mongoose.connect(process.env.URI);
    console.log("db connection established 🙃");
    cb();
  } catch (error) {
    console.log("Couldn't connect to DB 💀");
    error.status = 500;
    return next(error);
  }
};
