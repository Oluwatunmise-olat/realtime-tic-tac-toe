const router = require("express").Router();

const Game = require("../models/game");
const Player = require("../models/player");

router.get("/", (req, res, next) => {
  return res.render("index");
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

router.get("/ping", (req, res) => {
  res.status(201).json({ success: true, msg: "df" });
});

module.exports = router;
