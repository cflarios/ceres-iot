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

/* app.set('socketio', io);
app.get("/web", (req,res) => {

  let socket_id = [];
  const io = req.app.get('socketio');

  io.on('connection', socket => {
     socket_id.push(socket.id);
     if (socket_id[0] === socket.id) {
       // remove the connection listener for any subsequent 
       // connections with the same ID
       io.removeAllListeners('connection'); 
     }

     socket.on('hello message', msg => {
       console.log('just got: ', msg);
       socket.emit('chat message', 'hi from server');

     })

  });
}) */

module.exports = app;