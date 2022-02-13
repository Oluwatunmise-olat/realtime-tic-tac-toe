const username = document.getElementById("username");
const roomID = document.getElementById("room-id");
const joinGameBtn = document.getElementById("join-game-btn");
const createGameBtn = document.getElementById("create-game-btn");

const alertDIV = document.getElementById("alert");

const ALERT_THEME = {
  success: "green",
  failure: "#f44336"
};

// Create Game Handler
createGameBtn.addEventListener("click", (e) => {
  createGame((room_id, error) => {
    if (error) {
      // show error alert
      createAlert(alertDIV, {
        color: ALERT_THEME["failure"],
        info: "An Error Occured"
      });
      return;
    }
    roomID.value = room_id;
    createAlert(alertDIV, {
      color: ALERT_THEME["success"],
      info: `ROOM ID: ${room_id}`
    });
    return;
  });
});

// Join Gaame Handler
joinGameBtn.addEventListener("click", () => {
  const data = { username: username.value, room_id: roomID.value };
  joinGame(data, (resp) => {
    if (resp.error) {
      createAlert(alertDIV, {
        color: ALERT_THEME["failure"],
        info: `${resp.error.message}`
      });
      return;
    }
    window.location.replace(`/room/${resp.data.room_id}`);
  });
});

const createAlert = (parent, style) => {
  parent.classList.add("alert");
  parent.style.backgroundColor = style.color;

  let child = document.createElement("span");
  child.classList.add("closebtn");
  child.onclick = () => {
    parent.style.display = "none";
  };
  child.innerHTML = `&times`;
  parent.textContent = style.info;
  child.marginTop = "15px;";

  parent.appendChild(child);
};
