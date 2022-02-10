const mongoose = require("mongoose");
const { v4: uuid4 } = require("uuid");

const playerSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  playerID: {
    type: String,
    default: () => {
      return uuid4().slice(0, 4);
    },
    unique: true
  },
  gameID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Game",
    required: true
  },
  sign: String
});

module.exports = mongoose.model("Player", playerSchema);
