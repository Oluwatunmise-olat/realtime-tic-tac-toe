const Game = require("../models/game");

const { indexMapping } = require("./states");

exports.canPlay = async (roomID) => {
  let game;
  let valid = false;

  // valid == true means we can still make a move

  try {
    game = await Game.findOne({ roomID });
  } catch (error) {
    error.status = 500;
    throw error;
  }

  if (!game) {
    // handle error
  }

  board = game.board;
  board.forEach((layer) => {
    layer.forEach((piece) => {
      if (piece === -1) {
        valid = true;
      }
    });
  });

  return valid;
};

exports.winOrDraw = async (roomID) => {
  let game;
  let status = {};
  let player = {};

  try {
    game = await Game.findOne({ roomID }).populate("players");
  } catch (error) {
    error.status = 500;
    throw error;
  }

  if (!game) {
    // handle error
  }

  const board = game.board;

  let idx1 = board[0][0],
    idx2 = board[0][1],
    idx3 = board[0][2],
    idx4 = board[1][0],
    idx5 = board[1][1],
    idx6 = board[1][2],
    idx7 = board[2][0],
    idx8 = board[2][1],
    idx9 = board[2][2];

  console.log(idx1, idx2, idx3, idx4, idx5, idx6, idx7, idx8, idx9);

  console.log(idx1 == idx2 && idx1 == idx3, idx2 == idx3);

  // if true and not equals to -1

  if (
    ((idx1 == idx3) && (idx1 == idx2) && (idx1 != -1)) ||
    ((idx1 == idx4) && (idx1 == idx7) && (idx1 != -1)) ||
    ((idx1 == idx5) && (idx1 == idx9) && (idx1 != -1)) ||
    ((idx2 == idx5) && (idx2 == idx8) && (idx2 != -1)) ||
    ((idx3 == idx5) && (idx3 == idx7) && (idx3 != -1)) ||
    ((idx3 == idx6) && (idx3 == idx9) && (idx3 != -1)) ||
    ((idx4 == idx5) && (idx4 == idx6) && (idx4 != -1)) ||
    ((idx7 == idx8) && (idx7 == idx9) && (idx7 != -1))
  ) {
    console.log("win case 👌");
    status.win = true;
    status.sign = idx1;
  } else {
    status.win = false;
    status.sign = "";
  }

  if (status.win) {
    game.players.forEach((_player) => {
      if (_player.sign.toUpperCase() == status.sign.toUpperCase()) {
        player.playerID = _player.playerID;
        player.username = _player.username;
      }
    });
  }

  return { player, status };
};

exports.playerMove = (index) => {
  let [idx1, idx2] = indexMapping(index);
  return [idx1, idx2];
};
