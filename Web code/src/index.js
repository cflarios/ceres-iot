const app = require("./app");
require("./database");
const Task = require("./models/Task");

const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

/// sockets
io.on("connection", async (socket) => {
  console.log("a user connected");
  let tasks = await Task.find().lean();
  console.log(tasks.length);
  io.emit("temp", tasks);
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

// Tópicos que publica
const topic0 = "ceres/#";
const topic1 = "ceres/sensor/ambiente/temperatura";
const topic2 = "ceres/sensor/ambiente/humedad";
const topic3 = "ceres/sensor/fotoresistencia/estado";
const topic4 = "ceres/sensor/fotoresistencia";
const topic6 = "ceres/sensor/planta/humedad-tierra";
const topic7 = "ceres/tanque/principal/estado";
const topic8 = "ceres/tanque/auxiliar/estado";
const topic9 = "ceres/tanque/principal/volumen-total";
const topic10 = "ceres/tanque/auxiliar/volumen-total";
const topic11 = "ceres/tanque/principal/volumen-liquido";
const topic12 = "ceres/tanque/auxiliar/volumen-liquido";
const topic13 = "ceres/tanque/principal/porcentaje-liquido";
const topic14 = "ceres/tanque/auxiliar/porcentaje-liquido";
// Tópicos a los que se suscribe
const topicPub1 = "ceres/led";
const topicPub2 = "ceres/slider";
const topicPub3 = "ceres/slider2";
// MQTT varibles
const mqtt = require("mqtt");
const host = "test.mosquitto.org";
const port = "1884";
const username = "rw";
const password = "readwrite";
const clientId = `mqtt_${Math.random().toString(16).slice(3)}`;
const connectUrl = `mqtt://${host}:${port}`;
//funcion de conexion
const client = mqtt.connect(connectUrl, {
  clientId,
  clean: true,
  connectTimeout: 4000,
  username: username, //username: 'emqx',
  password: password, //password: 'public',
  reconnectPeriod: 1000,
});
//subcripcion a una variedad de topicos
client.on("connect", function () {
  client.subscribe(topic0);
  console.log("Client subscribed");
});
/* function delay(time) {
  return new Promise(resolve => setTimeout(resolve, time));
}  */
 var step = 1;
 client.on("message", (topic, message) => {
  
  if (
    topic == topic1 ||
    topic == topic2 ||
    topic == topic4 ||
    topic == topic6
  ) {
    if (step > 36 && step < 41) {
      //almacenado en database
       (async () => {
        const task = Task({ topic: topic, value: message });
        const saveTask = await task.save();
        console.log(saveTask);
      })();
      console.log(step);
      step++;
    } else {
      step++;
    }
    if(step > 40) {
      step = 1;
      
    }
  }
}); 
//mensaje que se recibe
client.on("message", (topic, message) => {
  //enviar el topico de temperatura al HTfML
  if (topic == topic1) {
    io.emit(topic1, {
      value: message.toString(),
    });
  }
  //enviar el topico de humedadAmbiente al HTML
  if (topic == topic2) {
    io.emit(topic2, {
      value: message.toString(),
    });
  }
  //enviar el topico de el estado de la fotoresistencia al HTML
  if (topic == topic3) {
    io.emit(topic3, {
      value: message.toString(),
    });
  }
  //enviar el topico de la fotoresistencia al HTML
  if (topic == topic4) {
    io.emit(topic4, {
      value: message.toString(),
    });
  }
  //enviar el topico de humedadTierra al HTML
  if (topic == topic6) {
    io.emit(topic6, {
      value: message.toString(),
    });
  }

  //enviar el topico de estado tanque principal al HTML
  if (topic == topic7) {
    io.emit(topic7, {
      value: message.toString(),
    });
  }
  //enviar el topico de estado tanque reserva al HTML
  if (topic == topic8) {
    io.emit(topic8, {
      value: message.toString(),
    });
  }
  //enviar el topico de volumen total tanque principal al HTML
  if (topic == topic9) {
    io.emit(topic9, {
      value: message.toString(),
    });
  }
  //enviar el topico de volumen total tanque reserva al HTML
  if (topic == topic10) {
    io.emit(topic10, {
      value: message.toString(),
    });
  }
  //enviar el topico de volumen liquido tanque principal al HTML
  if (topic == topic11) {
    io.emit(topic11, {
      value: message.toString(),
    });
  }
  //enviar el topico de volumen liquido tanque reserva al HTML
  if (topic == topic12) {
    io.emit(topic12, {
      value: message.toString(),
    });
  }

  //enviar el topico tanque pricipal porcentaje-liquito al HTML
  if (topic == topic13) {
    io.emit(topic13, {
      value: message.toString(),
    });
  }
  //enviar el topico tanque reserva porcentaje-liquito al HTML
  if (topic == topic14) {
    io.emit(topic14, {
      value: message.toString(),
    });
  }
  // console.log(topic + " - " + message.toString());
});
//publicacion de topicos que vienen del HTML
io.on("connection", (socket) => {
  socket.on(topicPub1, (msg) => {
    client.publish(topicPub1, msg.toString());
    console.log(msg.toString());
  });
});
io.on("connection", (socket) => {
  socket.on(topicPub2, (msg) => {
    client.publish(topicPub2, msg.toString());
    console.log(msg.toString());
  });
});
io.on("connection", (socket) => {
  socket.on(topicPub3, (msg) => {
    client.publish(topicPub3, msg.toString());
    console.log(msg.toString());
  });
});



server.listen(process.env.PORT || 4000, () => console.log(`Server started!`));
