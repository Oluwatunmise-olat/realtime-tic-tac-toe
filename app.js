const express = require("express");
const { Server } = require("http");
const path = require("path");

const app = express();
const server = require("http").createServer(app);

app.set("view engine", "ejs");

app.use(expess.static(path.join(__dirname, "public")));

server.listen(process.env.PORT || 8080, () =>
  console.log("server listening for requests ...")
);
