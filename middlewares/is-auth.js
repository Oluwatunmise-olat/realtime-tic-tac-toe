const Game = require("../models/game");
const Player = require("../models/player");

exports.isAllowed = async (req, res, next) => {
  const path = req.path.split("/");
  let roomID = path[path.length - 1];

  if (!req.session.userID) {
    return res.status(401).send("You are not allowed to view this page");
  }

  // verify room exists

  let game;

  try {
    game = await Game.findOne({ roomID }).populate("players", "_id");
  } catch (error) {
    error.status = 500;
    return next(error);
  }

  if (!game) {
    return res.status(401).send("You are not allowed to view this page");
  }

  // verify userID is associated with the room

  let isValid = false;

  game.players.forEach((player) => {
    if (player._id.toString() == req.session.userID) {
      isValid = true;
    }
  });

  if (!isValid) {
    return res.status(401).send("You are not allowed to view this page");
  }

  return next();
};

// room id must be valid and userID must be associated with roomID
