if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const cors = require("cors");
const express = require("express");
const path = require("path");
const session = require("express-session");
const sharedsession = require("express-socket.io-session");
const MongoStore = require("connect-mongodb-session")(session);

const db = require("./db/init");
const router = require("./routes/index.routes");
const ws = require("./sockets/game");

const app = express();
const server = require("http").Server(app);
const store = new MongoStore({
  uri: process.env.URI,
  collection: "session"
});
const sess = session({
  secret: process.env.SECRET_KEY,
  resave: false,
  saveUninitialized: true,
  store
});

store.on("error", (err) => {
  throw err;
});

app.set("view engine", "ejs");

app.use(cors())
app.use(express.static(path.join(__dirname, "public")));
app.use([express.json(), express.urlencoded({ extended: false })]);
app.use(sess);
app.use(router);

// Error Handler
app.use((error, req, res, next) => {
  if (error.status == 404) {
    res.redirect("/404");
  }

  if (error.status == 500) {
    console.log("Technical Error");
  }
  return next();
});

ws(server).use(sharedsession(sess));

db(() => {
  server.listen(
    process.env.PORT || 8080,
    console.log("server listening for requests ...")
  );
});
