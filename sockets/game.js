const io = require("socket.io");

const Game = require("../models/game");
const Player = require("../models/player");

// TODO:: Add socket auth middleware

const ws = (httpServer) => {
  _io = io(httpServer, { cors: { origin: ["*"] } });
  consumer(_io);

  return _io;
};

const consumer = (_io) => {
  _io.on("connection", (socket) => {
    socket.on("players", async ({ roomID }) => {
      // console.log(socket.handshake.session);

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
  });
};

module.exports = ws;
