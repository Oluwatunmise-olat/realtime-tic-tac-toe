const createGame = (cb) => {
  axios
    .post("/create")
    .then(({ data: { room_id, error } }) => {
      return cb(room_id, error);
    })
    .catch((err) => console.error(err));
};

const joinGame = ({ username, room_id }, cb) => {
  axios
    .post(
      "/join",
      { username, room_id },
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    )
    .then(({data}) => {
      cb(data);
    })
    .catch((err) => {
      cb(err.response.data);
    });
};
