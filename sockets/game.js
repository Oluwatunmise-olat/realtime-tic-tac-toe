const io = require("socket.io");

const Game = require("../models/game");
const Player = require("../models/player");

const ws = (httpServer) => {
  _io = io(httpServer, { cors: { origin: ["*"] } });
  return consumer(_io);
};

const consumer = (_io) => {
  _io.on("connection", (socket) => {
    socket.on("players", async ({ roomID }) => {
      const game = await Game.findOne({ roomID }).populate("players");
      let players = game.players.map(async (player) => {
        return {
          username: player.username,
          playerID: player.playerID,
          playerChar: player.sign
        };
      });

      console.log(players);

      let data = { players, playerTurn: game.user_turn_id };

      _io.sockets.in(roomID).emit("players-data", data);
    });

    socket.on("join-room", (room) => {
      socket.join(room);
    });
  });
};

module.exports = ws;
