const mongoose = require("mongoose");
const { v4: uuid4 } = require("uuid");

const gameSchema = new mongoose.Schema(
  {
    roomID: {
      required: true,
      type: String,
      default: () => {
        return uuid4();
      }
    },
    players: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Player"
      }
    ],
    user_turn_id: {
      type: String,
      ref: "Player"
    },
    board: {
      type: mongoose.Schema.Types.Array,
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
  if (val.length > 2){
    throw new Error("Room Occupied")
  }
  return true;
};

gameSchema.index({ roomID: -1 });

gameSchema
  .path("players")
  .validate(maxPlayerValidator, "A game can only consist of two players");

module.exports = mongoose.model("Game", gameSchema);
