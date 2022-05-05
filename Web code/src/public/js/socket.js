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

let counters = 0;

var socket = io();
function myFunction() {
  // Get the checkbox
  var checkBox = document.getElementById("myCheck");
  // Get the output text
  // If the checkbox is checked, display the output text
  if (checkBox.checked == true) {
    socket.emit(topicPub1, 'on')
  } else {
    socket.emit(topicPub1, 'off')
  }
}
var elInput3 = document.querySelector('#input3');
if (elInput3) {
  var etq = document.querySelector('.etiqueta');
  if (etq) {
    etq.innerHTML = elInput3.value;
    elInput3.addEventListener('input', function () {
      // cambia el valor de la etiqueta (el tooltip) 
      etq.innerHTML = elInput3.value;
      // cambia la posición de la etiqueta (el tooltip) 
      socket.emit(topicPub2, elInput3.value);
    }, false);

  }
}

socket.on(topic1, function (data) {
  if (temperatureGrafic.data.labels.length > 20) {
    temperatureGrafic.data.labels.length = 0;
    temperatureGrafic.data.datasets.forEach((dataset) => {
      dataset.data.length = 0;
    });
    counters = 0;
  } else {
    temperatureGrafic.data.labels.push(counters);
    temperatureGrafic.data.datasets.forEach((dataset) => {
      dataset.data.push(data.value);
    });
    counters++;
  }
  temperatureGrafic.update();
});
socket.on(topic2, function (data) {
  environmentHumedity.data.datasets.forEach((dataset) => {
    dataset.needleValue = data.value;
  });
  environmentHumedity.update();
});

socket.on(topic4, function (data) {
  luzFoto.data.datasets.forEach((dataset) => {
    dataset.needleValue = data.value;
  });
  luzFoto.update();
})

socket.on(topic6, function (data) {

  humiditySoil.data.datasets.forEach((dataset) => {
    dataset.needleValue = data.value;
  });
  humiditySoil.update();
});

socket.on(topic13, function (data) {
  tankWater1.data.datasets.forEach((dataset) => {
    dataset.data = [data.value];
  });
  tankWater1.update();
});
socket.on(topic14, function (data) {
  tankWater2.data.datasets.forEach((dataset) => {
    dataset.data = [data.value];
  });
  tankWater2.update();
});

socket.on(topic7, function (data) {
  var dato = document.getElementById("estadoPricipal");
  dato.innerHTML = data.value
});
socket.on(topic9, function (data) {
  var dato = document.getElementById("totalPricipal");
  dato.innerHTML = data.value
});
socket.on(topic11, function (data) {
  var dato = document.getElementById("liquidoPricipal");
  dato.innerHTML = data.value
});
socket.on(topic8, function (data) {
  var dato = document.getElementById("estadoReserva");
  dato.innerHTML = data.value
});
socket.on(topic10, function (data) {
  var dato = document.getElementById("totalReserva");
  dato.innerHTML = data.value
});
socket.on(topic12, function (data) {
  var dato = document.getElementById("liquidoReserva");
  dato.innerHTML = data.value
});