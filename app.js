require("dotenv").config();
const express = require("express");
const path = require("path");

const db = require("./db/init");
const router = require("./routes/index.routes");

const app = express();
const server = require("http").createServer(app);

app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "public")));
app.use([express.json(), express.urlencoded({ extended: false })]);
app.use(router);

db(() => {
  server.listen(process.env.PORT || 8080, () =>
    console.log("server listening for requests ...")
  );
});
