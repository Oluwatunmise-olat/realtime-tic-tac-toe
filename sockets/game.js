const io = require("socket.io");

const Game = require("../models/game");
const Player = require("../models/player");
const { canPlay, playerMove, winOrDraw } = require("../sockets/game-status");

// TODO:: Add socket auth middleware

const ws = (httpServer) => {
  _io = io(httpServer, { cors: { origin: ["*"] } });
  consumer(_io);

  return _io;
};

const consumer = (_io) => {
  _io.on("connection", (socket) => {
    let session = socket.handshake.session;

    socket.on("players", async ({ roomID }) => {
      // this would could cause bug
      const game = await Game.findOne({ roomID }).populate("players");

      let players = game.players.map((player) => {
        return {
          username: player.username,
          playerID: player.playerID,
          sign: player.sign
        };
      });

      let data = { players, playerTurn: game.user_turn_id };
      _io.sockets.in(roomID).emit("players-data", data);
    });

    socket.on("join-room", (room) => {
      socket.join(room);
    });

    socket.on("move", async ({ index, roomID }) => {
      // check the incoming user and verify against game turn id

      let game;
      let player;
      let sign;

      try {
        game = await Game.findOne({ roomID }).populate("players", "playerID");
        player = await Player.findOne({ _id: session.userID });
      } catch (error) {
        error.status = 500;
        throw error;
      }

      if (!game) {
        // handles client side error
        _io.sockets
          .in(roomID)
          .emit("error", { msg: "Invalid room ID", status: 404 });
        return;
      }

      if (game && player && game.user_turn_id === player.playerID) {
        let players = game.players;
        let _canPlay = canPlay(roomID);

        if (!_canPlay) {
          // handle draw case
          _io.sockets
            .in(roomID)
            .emit("error", { msg: "Game Ended as a Draw", status: 200 });
          return;
        }

        sign = player.sign;

        let [idx1, idx2] = playerMove(index, game, sign);

        // preventing change of move
        game.board[idx1][idx2] =
          game.board[idx1][idx2] != -1 ? game.board[idx1][idx2] : sign;
        game.markModified("board");
        await game.save();

        // change user_turn_id
        players.forEach(async (_player) => {
          if (_player.playerID != player.playerID) {
            game.user_turn_id = _player.playerID;
            await game.save();
          }
        });

        let winOrDrawResp = await winOrDraw(roomID);

        if (winOrDrawResp.status.win) {
          // handle win case
          _io.sockets.in(roomID).emit("move", { index, sign });
          _io.sockets.in(roomID).emit("end", winOrDrawResp);
          console.log(winOrDrawResp, "win state");
        } else {
          // emit user turn event
          _io.sockets
            .in(roomID)
            .emit("playerTurn", { playerTurn: game.user_turn_id });
          _io.sockets.in(roomID).emit("move", { index, sign });
        }
      } else {
        // emit not turn error
        // _io.sockets.in(roomID).emit("error", {msg:"Not Your Turn"})
      }
    });
  });
};

module.exports = ws;

/**
 * signal for board state persistence
 */
