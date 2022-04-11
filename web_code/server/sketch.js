
var client = mqtt.connect("ws://broker.emqx.io:8083/mqtt");
//Si lo usas en hosting para usar encriptado https
//var client = mqtt.connect("wss://test.mosquitto.org:8081/mqtts")

function EventoConectar() {
  console.log("Conectado a MQTT");
  client.subscribe("esp/#", function (err) {
    if (!err) {
      //client.publish("ALSW/Temperatura", "30");
      document.body.classList.add("running");
      console.log("good");
    }
  });
}
let uno = 0;
let dos = 0;
let tres=0;
let counters = 0;
function EventoMensaje(topic, message) {
  if (topic == "esp/dht/temperature") {
    console.log("La Temperatura es " + message.toString());
    temperatureGrafic.data.labels.push(counters);
    temperatureGrafic.data.datasets.forEach((dataset) => {
      dataset.data.push(message.toString());
    });
    counters++;
    temperatureGrafic.update();
  }
  if (topic == "esp/dht/humidity/innen" || topic == "esp/dht/humidity" ) {
   // console.log("La humedad es " + message.toString());
    uno = message;
    dos = 100 - message;
    /*humiditySoil.data.datasets.data.push(uno,dos);*/
    humiditySoil.data.datasets.forEach((dataset) => {
      dataset.data = [uno,dos];
    });
    humiditySoil.update();
  }
  if (topic == "esp/dht/humidity") {
    console.log("La humedad " + message.toString());

    tankWater1.data.datasets.forEach((dataset) => {
     dataset.data = [message.toString()];
    }); 
    
    tankWater1.update();
  }
  if (topic == "esp/luz") {
  console.log(topic + " - " + message.toString());
}
console.log(topic + " - " + message.toString());
}
function save(){
  client.publish("esp/luz", "on");
  //console.log("hola")
}
client.on("connect", EventoConectar);
client.on("message", EventoMensaje);
//client.on("message", tal);

console.log("Empezando a conectar");
