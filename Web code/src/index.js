const express = require("express");
const app = express();
const path = require("path");
const http = require('http');
const { Server } = require("socket.io")
const server = http.createServer(app);
const io = new Server(server);
// settings
app.set("port", 4000)
app.set("view engine","ejs")
app.set("views", path.join(__dirname, "views"))
app.engine("html", require("ejs").renderFile)
// routers
app.use(require('./routers/router'))
//
app.use(express.static(path.join(__dirname, "public")))
/* app.listen(app.get("port"), ()=>{
  console.log("server on port", app.get("port"))
}) */
/// sockets
io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});
// MQTT varibles 
const mqtt = require("mqtt");
const host = 'test.mosquitto.org'
const port = '1884'
const clientId = `mqtt_${Math.random().toString(16).slice(3)}`
const connectUrl = `mqtt://${host}:${port}`
//funcion de conexion
const client = mqtt.connect(connectUrl, {
  clientId,
  clean: true,
  connectTimeout: 4000,
  username: 'rw',       //username: 'emqx',
  password: 'readwrite',//password: 'public',
  reconnectPeriod: 1000,
})
//subcripcion a una variedad de topicos
client.on("connect",function()
{   
    client.subscribe('esp32/#');
    console.log("Client subscribed");
});
//mensaje que se recibe
client.on("message",function(topic, message){
  //enviar el topico de temperatura al HTML
  if (topic == "esp32/temperatura") {
    io.emit("esp:temperatura",{
      value: message.toString()
    })
  }
  //enviar el topico de humedad al HTML
  if (topic == "esp32/humedad") {
    io.emit("esp:humedad",{
      value: message.toString()
    })
  }
  //enviar el topico de distancia al HTML
  if (topic == "esp32/distancia") {
    io.emit("esp:distancia",{
      value: message.toString()
    })
  }
 // console.log(topic + " - " + message.toString());
  
});
//publicacion del switch que viene del HTML 
io.on('connection', (socket) => {
  socket.on('esp32:luz', (msg) => {
    client.publish("esp32/LED", msg.toString())
    console.log(msg.toString());
  });
});
io.on('connection', (socket) => {
  socket.on("esp32:slider", (msg) => {
    client.publish("esp32/PWM", msg.toString())
    console.log(msg.toString());
  });
});


server.listen(app.get("port"), () => {
  console.log('listening on: '+app.get("port"));
});