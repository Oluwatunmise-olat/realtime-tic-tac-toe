const mongoose = require("mongoose");

const gameSchema = new mongoose.Schema(
  {
    players: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Player"
      }
    ],
    user_turn_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Player"
    },
    board: {
      default: [
        [-1, -1, -1],
        [-1, -1, -1],
        [-1, -1, -1]
      ]
    }
  },
  { timestamps: true }
);

const maxPlayerValidator = (val) => {
  console.log(val, "from gameschema");
  return val.length <= 2;
};

gameSchema
  .path("players")
  .validate(maxPlayerValidator, "A game can only consist of two players");

module.exports = mongoose.model("Game", gameSchema);
