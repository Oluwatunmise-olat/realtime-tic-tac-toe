const router = require("express").Router();
const { body, validationResult } = require("express-validator");

const Game = require("../models/game");
const Player = require("../models/player");
const { isAllowed } = require("../middlewares/is-auth");

router.get("/ping", (req, res) => {
  res.status(201).json({ success: true, msg: "pong" });
});

router.get("/", (req, res, next) => {
  return res.render("index");
});

router.get("/404", (req, res) => {
  return res.render("error/404.ejs");
});

router.get("/room/:roomID", isAllowed, async (req, res, next) => {
  const { roomID } = req.params;

  let game;

  try {
    game = await Game.findOne({ roomID }).populate("players");
  } catch (error) {
    error.status = 500;
    next(error);
  }

  if (!game) {
    return res.status(404).redirect("/404");
  }

  if (game.players.length == 2) {
    game.user_turn_id =
      game.players[Math.floor(Math.random() * game.players.length)].playerID;
  }else {
    game.user_turn_id = "Await player 2"
  }

  await game.save()

  let players = game.players.map((player) => {
    return { username: player.username, playerID: player.playerID };
  });

  let canStart = game.players.length == 2 ? true : false;

  return res.render("game.ejs", {
    error: "",
    data: {
      users: players,
      userCharacter: req.session.userSign,
      start: canStart,
      roomID:game.roomID
    }
  });
});

router.post("/create", async (req, res, next) => {
  try {
    const game = await Game.create({});
    return res.status(201).json({
      room_id: game.roomID,
      error: false
    });
  } catch (error) {
    error.status = 500;
    return next(error);
  }
});

router.post(
  "/join",
  [body("room_id").trim().notEmpty(), body("username").trim().notEmpty()],
  async (req, res, next) => {
    const { room_id, username } = req.body;
    const errors = validationResult(req);

    if (errors.length > 0) {
      return res.status(400).json({ error: { message: "Invalid data" } });
    }

    // check if it's a valid game instance

    let game;
    let player;
    const states = ["X", "O"];

    try {
      game = await Game.findOne({ roomID: room_id }).populate("players");
    } catch (error) {
      error.status = 500;
      next(error);
    }

    
    if (!game) {
      return res
      .status(400)
      .json({ error: { message: "Game Room Not Found" } });
    }
    
    const players = game.players;
    
    if (players.length == 2) {
      // store user_id in request session and user_turn;
      return res.status(400).json({ error: { message: "Room Occupied" } });
    }

    // set players character sign
    let sign;

    if (players) {
      players.forEach((player) => {
        sign = player.sign == states[0] ? states[1] : states[0];
      });
    } else {
      sign = states[Math.floor(Math.random() * states.length)];
    }

    try {
      player = await Player.create({
        username,
        gameID: game._id.toString(),
        sign
      });
    } catch (error) {
      error.status = 500;
      next(error);
    }

    game.players.push(player);
    await game.save();

    req.session.userID = player._id;
    req.session.userSign = sign;

    return res.status(200).json({ error: "", data: { room_id: game.roomID } });
  }
);

module.exports = router;
