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

var socket = io();
socket.on("temp", function (data) {
  console.log(data.length);
  processData(data);
});

/* function makeplot() {
  d3.csv("https://raw.githubusercontent.com/plotly/datasets/master/2014_apple_stock.csv", function(data){ processData(data) } );

}; */
/* fetch('https://coasters-api.herokuapp.com/')
    .then(response => response.json())
    .then(data => processData(data)) */

function processData(allRows) {
  document.body.classList.add("running");

  console.log(allRows.length);
  var x = [],
    y = []
  for (var i = 0; i < allRows.length; i++) {
    row = allRows[i];
    if (row.topic == topic2) {
      x.push(row["createdAt"]);
      y.push(row["value"]); 
      fotoResistencia(x, y);
    }
    /* if (row.topic == topic4) {
      x.push(row["createdAt"]);
      y.push(row["value"]);
      
      fotoResistencia(x, y, standard_deviation);
    } */
    /* if (row.topic == "ceres/sensor/ambiente/humedad") {
      x.push(row["createdAt"]);
      y.push(row["value"]);
      
      makePlotly(x, y, standard_deviation);
    }
    if (row.topic == "ceres/sensor/ambiente/humedad") {
      x.push(row["createdAt"]);
      y.push(row["value"]);
      makePlotly(x, y, standard_deviation);
    } */
  }
}

function humedadAm(x, y,) {
  var traces = [
    {
      x: x,
      y: y,
      mode: "lines+markers",
      name: "Scatter + Lines",
    },
  ];
  var config = { responsive: true };
  var layout = {
    font: { color: "#6b6f8a" },
    barmode: "stack",
    paper_bgcolor: "#242e42",
    plot_bgcolor: "#242e42",
    showlegend: false,
    margin: {
      l: 40,
      r: 20,
      b: 10,
      t: 60,
      pad: 1,
    },
    /*  width: 800,*/
    height: 350,
    title: "Grafica Historica de la Humedad del Ambiente",
    xaxis: {
      autorange: true,
      rangeselector: {
        buttons: [
          {
            step: "week",
            stepmode: "backward",
            count: 1,
            label: "1w",
          },
          {
            step: "month",
            stepmode: "backward",
            count: 1,
            label: "1m",
          },
          {
            step: "month",
            stepmode: "backward",
            count: 6,
            label: "6m",
          },
          {
            step: "year",
            stepmode: "todate",
            count: 1,
            label: "YTD",
          },
          {
            step: "year",
            stepmode: "backward",
            count: 1,
            label: "1y",
          },
          {
            step: "all",
          },
        ],
      },
      rangeslider: {},
      type: "date",
    },
    yaxis: {
      fixedrange: true,
      type: "linear",
    },
  };

  Plotly.newPlot("humedadAmbiente", traces, layout, config);
}
function fotoResistencia(x,y) {
  var trace1 = {
    x: x,
    y: y,
    name: "control",
    autobinx: false,
    histnorm: "count",
    marker: {
      color: "rgba(255, 100, 102, 0.7)",
      line: {
        color: "rgba(255, 100, 102, 1)",
        width: 1,
      },
    },
    opacity: 0.5,
    type: "histogram",
    xbins: {
      end: 2.8,
      size: 0.06,
      start: 0.5,
    },
  };
  /* var trace2 = {
    x: x2,
    y: y2,
    autobinx: false,
    marker: {
      color: "rgba(100, 200, 102, 0.7)",
      line: {
        color: "rgba(100, 200, 102, 1)",
        width: 1,
      },
    },
    name: "experimental",
    opacity: 0.75,
    type: "histogram",
    xbins: {
      end: 4,
      size: 0.06,
      start: -3.2,
    },
  }; */
  var data = [trace1];
  var layout = {
    bargap: 0.05,
    bargroupgap: 0.2,
    barmode: "overlay",
    title: "Sampled Results",
    xaxis: { title: "Value" },
    yaxis: { title: "Count" },
  };
  Plotly.newPlot("fotoRes", data, layout);
}
