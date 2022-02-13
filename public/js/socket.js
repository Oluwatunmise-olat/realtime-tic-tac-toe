const ws = io("https://git.heroku.com/tic-tac-realtime.git");


const path = window.location.pathname.split("/");
const roomID = path[path.length - 1];

document.getElementById("_room-id").value = roomID;
const player_turn_div = document.getElementById("player-turn");
const turn = document.getElementById("turn");
const boardDiv = document.getElementById("game-board");
const playersDIV = document.getElementById("players");

ws.on("players-data", (data) => {
  createPlayers(data.players);

  if (data.players.length == 2) {
    activateBoard();
  }

  displayPlayerTurn(data.playerTurn);
});

window.addEventListener("DOMContentLoaded", () => {
  ws.on("connect", () => {
    console.log("Websocket Connected");
  });

  ws.emit("join-room", roomID);
  ws.emit("players", { roomID });

});

const displayPlayerTurn = (playerTurn) => {
  player_turn_div.classList.remove("disabled");
  turn.textContent = playerTurn;
};

const activateBoard = () => {
  boardDiv.classList.remove("disabled");
};

const createPlayers = (players) => {
  let el = document.getElementById("players--child");
  if (el) {
    el.remove();
  }

  players.forEach((player) => {
    let container = document.createElement("div");
    container.setAttribute("class", "players--child");
    container.setAttribute("id", "players--child");

    let username = document.createElement("p");
    let playerID = document.createElement("p");
    let sign = document.createElement("p");

    username.textContent = player.username;
    playerID.textContent = player.playerID;
    sign.textContent = player.sign;

    container.appendChild(username);
    container.appendChild(playerID);
    container.appendChild(sign);

    playersDIV.appendChild(container);
  });
};
