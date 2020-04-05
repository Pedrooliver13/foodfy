const express = require("express");
const nunjucks = require("nunjucks");
const methodOverride = require("method-override");

const server = express();
const routes = require("../router");

server.set("view engine", "njk");

nunjucks.configure("src/app/view", {
  express: server,
  autoescape: false,
  noCache: true,
});

server.use(express.static("public"));
server.use(express.urlencoded({ extended: true }));
server.use(methodOverride("_method"));
server.use(routes);

server.listen(1313, ()=> console.log("Serve is Running"));
