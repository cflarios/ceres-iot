const express = require("express");
const app = express();
const path = require("path");
const router = require('./routers/router');
////fumada
/* const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server); */
// settings
app.set("view engine","ejs")
app.set("views", path.join(__dirname, "views"))
app.engine("html", require("ejs").renderFile)
// routers
app.use(router.router);
app.use(express.static(path.join(__dirname, "public")));



module.exports = app;