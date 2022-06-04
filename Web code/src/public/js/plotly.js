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

function processData(allRows) {
  document.body.classList.add("running");
  console.log(allRows.length);
  fotoResistencia(allRows);
  /* hAmbiente(allRows); */
  tAmbiente(allRows);
  hTierra(allRows);

}
 function tAmbiente(allRows) {
  var count = 0
  var x = [],
    y = [];
  for (var i = 0; i < allRows.length; i++) {
    row = allRows[i];
    if (row.topic == topic2) {
      x.push(row["createdAt"]);
      y.push(row["value"]);
      count++
    }
  }
  var traces = [
    {
      x: x,
      y: y,
      line: {
        color: 'rgb(219, 64, 82)',
        width: 2
      },
      type: 'line'
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
     
    height: 380,
    title: "Grafica Historica de la Temperatura",
    xaxis: {
      autorange: true,
      rangeselector: {
        buttons: [
          {
            step: "hour",
            stepmode: "backward",
            count: 1,
            label: "1h",
          },
          {
            step: "hour",
            stepmode: "backward",
            count: 7,
            label: "7h",
          },
          {
            step: "day",
            stepmode: "backward",
            count: 1,
            label: "1d",
          },
          {
            step: "day",
            stepmode: "backward",
            count: 7,
            label: "1w",
          },
          {
            step: "month",
            stepmode: "backward",
            count: 1,
            label: "1m",
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

  Plotly.newPlot("temperatura", traces, layout, config);
} 
function hTierra(allRows) {
  var x = [],
    y = [];
  for (var i = 0; i < allRows.length; i++) {
    row = allRows[i];
    if (row.topic == topic6) {
      x.push(row["createdAt"]);
      y.push(row["value"]);
    }
  }

  var data = [
    {
      x: x,
      y: y, 
      line: {
        color: 'rgb(219, 64, 82)',
        width: 2
      },
      type: 'line'
    },
  ];
  var config = { responsive: true };
  var layout = {
    bargap: 0.05,
    bargroupgap: 0.2,
    barmode: "overlay",
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
    height: 380,
    title: "Grafica Historica de la Humedad Tierra",
    xaxis: {
      autorange: true,
      rangeselector: {
        buttons: [
          {
            step: "hour",
            stepmode: "backward",
            count: 1,
            label: "1h",
          },
          {
            step: "hour",
            stepmode: "backward",
            count: 7,
            label: "7h",
          },
          {
            step: "day",
            stepmode: "backward",
            count: 1,
            label: "1d",
          },
          {
            step: "day",
            stepmode: "backward",
            count: 7,
            label: "1w",
          },
          {
            step: "month",
            stepmode: "backward",
            count: 1,
            label: "1m",
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
  Plotly.newPlot("humedadTierra", data, layout, config);
}
function fotoResistencia(allRows) {
  var x = [],
    y = [];
  for (var i = 0; i < allRows.length; i++) {
    row = allRows[i];
    if (row.topic == topic4) {
      x.push(row["createdAt"]);
      y.push(row["value"]);
    }
  }

 
  var data = [
    {
      x: x,
      y: y,
      
      line: {
        color: 'rgb(219, 64, 82)',
        width: 2
      },
      type: 'line'
    },
  ];
  var config = { responsive: true };
  var layout = {
    bargap: 0.05,
    bargroupgap: 0.2,
    barmode: "overlay",
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
    height: 380,
    title: "Grafica Historica de la fotorresistencia",
    xaxis: {
      autorange: true,
      rangeselector: {
        buttons: [
          {
            step: "hour",
            stepmode: "backward",
            count: 1,
            label: "1h",
          },
          {
            step: "hour",
            stepmode: "backward",
            count: 7,
            label: "7h",
          },
          {
            step: "day",
            stepmode: "backward",
            count: 1,
            label: "1d",
          },
          {
            step: "day",
            stepmode: "backward",
            count: 7,
            label: "1w",
          },
          {
            step: "month",
            stepmode: "backward",
            count: 1,
            label: "1m",
          },
          {
            step: "all",
          },
        ],
      },
      rangeslider: {},
    },
    yaxis: {
      fixedrange: true,
      type: "linear",
    },
  
  };
  Plotly.newPlot("fotoRes", data, layout, config);
}