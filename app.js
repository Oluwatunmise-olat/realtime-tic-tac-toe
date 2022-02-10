require("dotenv").config();
const express = require("express");
const path = require("path");
const session = require("express-session");
const MongoStore = require("connect-mongodb-session")(session);

const db = require("./db/init");
const router = require("./routes/index.routes");

const app = express();
const server = require("http").createServer(app);
const store = new MongoStore({
  uri: process.env.URI,
  collection: "session"
});

store.on("error", (err) => {
  throw err;
});

app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "public")));
app.use([express.json(), express.urlencoded({ extended: false })]);
app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    store
  })
);
app.use(router);
app.use((error, req, res, next) => {
  console.log("an error occurred");
  console.log(error.message);
});

(async () => {
  await db(() => {
    server.listen(process.env.PORT || 8080, () =>
      console.log("server listening for requests ...")
    );
  });
})();
