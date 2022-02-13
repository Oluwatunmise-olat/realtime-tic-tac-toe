const _box = document.getElementsByClassName("box");

const box = Array.from(_box);
const ALERT_THEME = {
  success: "green",
  failure: "#f44336"
};
const alertDiv = document.getElementById("alert");

box.forEach((piece) => {
  piece.onclick = (e) => {
    const target = e.target;

    if (!target.classList.contains("disabled")) {
      moveHandler(parseInt(target.dataset.id));
    }
  };
});

// work on alert for winner
// disable board
ws.on("end", ({ status, player }) => {
  document.querySelector(".box").classList.add("disabled");
  Alert({ success: true, status, player });
  setTimeout(() => {
    location.reload();
  }, 4000);
});

ws.on("error", (data) => {
  if (data.status == 200) {
    data.success = false;
    Alert(data);
    setTimeout(() => {
      location.reload();
    }, 4000);
  }
});

ws.on("move", ({ index, sign }) => {
  moveDisplayHandler(index, sign);
});

ws.on("playerTurn", (data) => {
  displayPlayerTurn(data.playerTurn);
});

const moveHandler = (index) => {
  ws.emit("move", { index, roomID });
};

const moveDisplayHandler = (index, sign) => {
  let el = document.querySelector(`[data-id="${index}"`);
  el.textContent = sign;
  el.classList.add("disabled");
};

const Alert = (data) => {
  if (data.success) {
    alertDiv.classList.add("alert");
    alertDiv.style.backgroundColor = ALERT_THEME["success"];

    alertDiv.textContent = `winners name: ${data.player.username} :: winners ID: ${data.player.playerID} :: ${data.status.sign}`;
  } else {
    alertDiv.classList.add("alert");
    alertDiv.style.backgroundColor = ALERT_THEME["failure"];

    alertDiv.textContent = data.msg;
  }
  let child = document.createElement("span");
  child.classList.add("closebtn");
  child.marginTop = "15px;";
  child.onclick = () => {
    alertDiv.style.display = "none";
  };
  child.innerHTML = `&times`;
  alertDiv.appendChild(child);
};
