const mongoose = require("mongoose");

const playerSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  gameID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Game",
    required: true
  },
  sign: String
});

module.exports = mongoose.model("Player", playerSchema);
