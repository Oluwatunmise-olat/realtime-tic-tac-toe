const router = require("express").Router();
const { body, validationResult } = require("express-validator");

const { isAllowed } = require("../middlewares/is-auth");

const { ping } = require("../controller/health");
const { error404 } = require("../controller/error");
const { index, createGame, joinGame, getRoom } = require("../controller/game");

router.get("/ping", ping);

router.get("/", index);

router.get("/404", error404);
router.get("/room/:roomID", isAllowed, getRoom);

router.post("/create", createGame);

router.post(
  "/join",
  [body("room_id").trim().notEmpty(), body("username").trim().notEmpty()],
  joinGame
);

module.exports = router;
