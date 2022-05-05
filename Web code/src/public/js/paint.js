const temp = document.getElementById("tempGrafic").getContext("2d");
const soil = document.getElementById("humSoil").getContext("2d");
const environment = document.getElementById("humEnv").getContext("2d");
const water1 = document.getElementById("cylGauge1").getContext("2d");
const water2 = document.getElementById("cylGauge2").getContext("2d");
const luzPlant = document.getElementById("luzFot").getContext("2d");

/* var gradientStroke = temp.createLinearGradient(0, 230, 0, 50);
gradientStroke.addColorStop(1, "rgba(66,134,121,0.15)");
gradientStroke.addColorStop(0.4, "rgba(66,134,121,0.0)"); //green colors
gradientStroke.addColorStop(0, "rgba(66,134,121,0)"); //green colors */
var chartColor = "#FFFFFF";
var gradientStroke = temp.createLinearGradient(0, 230, 0, 50);

    gradientStroke.addColorStop(1, 'rgba(72,72,176,0.2)');
    gradientStroke.addColorStop(0.2, 'rgba(72,72,176,0.0)');
    gradientStroke.addColorStop(0, 'rgba(119,52,169,0)'); //purple colors

   var gradientFill = temp.createLinearGradient(0, 170, 0, 50);
    gradientFill.addColorStop(0, "rgba(128, 182, 244, 0)");
    gradientFill.addColorStop(1, "rgba(249, 99, 59, 0.40)");

var gradientStroke2 = luzPlant.createLinearGradient(500, 0, 100, 0);
gradientStroke2.addColorStop(0, "#80b6f4");
gradientStroke2.addColorStop(1, "#f49080");



const tankWater1 = new Chart(water1, {
  type: "bar",
  data: {
    labels: [""],
    datasets: [
      {
        label: "Nivel de agua",
        borderColor: "rgb(0, 255, 255)",
        backgroundColor: "rgba(0, 255, 255, 0.5)",
        data: [],
        borderWidth: 1,
        categoryPercentage: 1,
        barPercentage: 1,
        borderRadius: 5,
      },
    ],
  },
  options: {
    maintainAspectRatio: false,
    scaleFontColor: "#fff",
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        display: false,
      },
      y: {
        suggestedMax: 100,
      },
    },
  },
});
const tankWater2 = new Chart(water2, {
  type: "bar",
  data: {
    labels: [""],
    datasets: [
      {
        label: "Nivel de agua",
        borderColor: "rgb(0, 255, 255)",
        backgroundColor: "rgba(0, 255, 255, 0.5)",
        data: [],
        borderWidth: 1,
        categoryPercentage: 1,
        barPercentage: 1,
        borderRadius: 5,
      },
    ],
  },
  options: {
    maintainAspectRatio: false,
    scaleFontColor: "#fff",
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        display: false,
      },
      y: {
        suggestedMax: 100,
      },
    },
  },
});

const humiditySoil = new Chart(soil, {
  type: "doughnut",
  data: {
    labels: ["x", "y", "z"],
    datasets: [
      {
        data: [20, 30, 50],
        label: "humedad %",
        backgroundColor: ["red", "yellow", "green"],
        borderColor: "#1d2636",
        borderWidth: 2,
        needleValue: 0,
        circumference: 200,
        rotation: 260,
        cutout: "85%",
        borderRadius: 2,
      },
    ],
  },
  options: {
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        yAlign: "bottom",
        displayColors: false,
        callbacks: {
          label: function (tooltipItem, data, value) {
            const tracker = tooltipItem.dataset.needleValue;
            return `Tracker Score: ${tracker} %`;
          },
        },
      },
    },
  },
  plugins: [
    {
      afterDatasetDraw(chart, args, options) {
        const {
          ctx,
          config,
          chartArea: { top, bottom, left, right, width, height },
        } = chart;
        ctx.save();
        //console.log(ctx);
        const needleValue = humiditySoil.data.datasets[0].needleValue;
        const dataTotal = humiditySoil.data.datasets[0].data.reduce(
          (a, b) => a + b,
          0
        );
        const angle = Math.PI + (1 / dataTotal) * needleValue * Math.PI;

        const cx = width / 2;
        const cy = chart._metasets[0].data[0].y;

        // needle
        ctx.translate(cx, cy);
        ctx.rotate(angle);
        ctx.beginPath();
        ctx.moveTo(0, -3);
        ctx.lineTo(width / 2, 0);
        ctx.lineTo(0, 3);
        ctx.fillStyle = "#00d6b4";
        ctx.fill();

        // needle dot
        ctx.translate(-cx, -cy);
        ctx.beginPath();
        ctx.arc(cx, cy, 5, 0, 10);
        ctx.fill();
        ctx.restore();

        //needle number
        ctx.font = "25px Helvetica";
        ctx.fillStyle = "#00d6b4";
        ctx.fillText(needleValue + "%", cx, cy + 25);
        ctx.textAlign = "center";
        ctx.restore();
      },
    },
  ],
});

const environmentHumedity = new Chart(environment, {
  type: "doughnut",
  data: {
    labels: ["x", "y", "z"],
    datasets: [
      {
        data: [20, 30, 50],
        label: "humedad %",
        backgroundColor: ["red", "yellow", "green"],
        borderColor: "#1d2636",
        borderWidth: 2,
        needleValue: 0,
        circumference: 200,
        rotation: 260,
        cutout: "85%",
        borderRadius: 2,
      },
    ],
  },
  options: {
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        yAlign: "bottom",
        displayColors: false,
        callbacks: {
          label: function (tooltipItem, data, value) {
            const tracker = tooltipItem.dataset.needleValue;
            return `Tracker Score: ${tracker} %`;
          },
        },
      },
    },
  },
  plugins: [
    {
      /* id: "gaugeNeedle1", */
      afterDatasetDraw(chart, args, options) {
        const {
          ctx,
          config,
          chartArea: { top, bottom, left, right, width, height },
        } = chart;
        ctx.save();
        //console.log(ctx);
        const needleValue = environmentHumedity.data.datasets[0].needleValue;
        const dataTotal = environmentHumedity.data.datasets[0].data.reduce(
          (a, b) => a + b,
          0
        );
        const angle = Math.PI + (1 / dataTotal) * needleValue * Math.PI;

        const cx = width / 2;
        const cy = chart._metasets[0].data[0].y;

        // needle
        ctx.translate(cx, cy);
        ctx.rotate(angle);
        ctx.beginPath();
        ctx.moveTo(0, -2);
        ctx.lineTo(width / 2, 0);
        ctx.lineTo(0, 2);
        ctx.fillStyle = "#00d6b4";
        ctx.fill();

        // needle dot
        ctx.translate(-cx, -cy);
        ctx.beginPath();
        ctx.arc(cx, cy, 5, 0, 10);
        ctx.fill();
        ctx.restore();

        //needle number
        ctx.font = "25px Helvetica";
        ctx.fillStyle = "#00d6b4";
        ctx.fillText(needleValue + "%", cx, cy + 25);
        ctx.textAlign = "center";
        ctx.restore();
      },
    },
  ],
});
const luzFoto = new Chart(luzPlant, {
  type: "doughnut",
  data: {
    labels: ["x", "y", "z"],
    datasets: [
      {
        data: [20, 30, 50],
        label: "humedad %",
        backgroundColor: ["red", "yellow", "green"],
        borderColor: "#1d2636",
        borderWidth: 2,
        needleValue: 0,
        /* circumference: 180,
        rotation: 270, */
        cutout: "75%",
        borderRadius: 2,
      },
    ],
  },
  options: {
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        yAlign: "bottom",
        displayColors: false,
        callbacks: {
          label: function (tooltipItem, data, value) {
            const tracker = tooltipItem.dataset.needleValue;
            return `Tracker Score: ${tracker} %`;
          },
        },
      },
    },
  },
  plugins: [
    {
      /* id: "gaugeNeedle1", */
      afterDatasetDraw(chart, args, options) {
        const {
          ctx,
          config,
          chartArea: { top, bottom, left, right, width, height },
        } = chart;
        ctx.save();
        //console.log(ctx);
        const needleValue = luzFoto.data.datasets[0].needleValue;
        const dataTotal = luzFoto.data.datasets[0].data.reduce(
          (a, b) => a + b,
          0
        );
        const angle = Math.PI + (1 / dataTotal) * needleValue * Math.PI;

        const cx = width/2;
        const cy = chart._metasets[0].data[0].y;

        // needle
        /* ctx.translate(cx, cy);
        
        ctx.beginPath(); */
        /* ctx.moveTo(0, -2);
        ctx.lineTo(width / 2, 0);
        ctx.lineTo(0, 2);
        ctx.fillStyle = "#00d6b4";
        ctx.fill(); */

        // needle dot
        //ctx.translate(-cx, -cy);
        /* ctx.rotate(angle); */
        /* ctx.beginPath();
         */
        /* ctx.fill();
        ctx.restore();   */
       // ctx.arc(cx, cy, 5, 0, 10);
        //needle number
        ctx.font = "55px Helvetica";
        ctx.fillStyle = "#00d6b4";
        ctx.fillText(needleValue + "%", cx-30, cy+20 );
        ctx.textAlign = "center";
        ctx.restore();
      },
    },
  ],
});

gradientChartOptionsConfigurationWithTooltipPurple = {
  maintainAspectRatio: false,
  legend: {
    display: false
  },

  tooltips: {
    backgroundColor: '#f5f5f5',
    titleFontColor: '#333',
    bodyFontColor: '#666',
    bodySpacing: 4,
    xPadding: 12,
    mode: "nearest",
    intersect: 0,
    position: "nearest"
  },
  responsive: true,
  scales: {
    yAxes: [{
      barPercentage: 1.6,
      gridLines: {
        drawBorder: false,
        color: 'rgba(29,140,248,0.0)',
        zeroLineColor: "transparent",
      },
      ticks: {
        suggestedMin: 60,
        suggestedMax: 125,
        padding: 20,
        fontColor: "#9a9a9a"
      }
    }],

    xAxes: [{
      barPercentage: 1.6,
      gridLines: {
        drawBorder: false,
        color: 'rgba(225,78,202,0.1)',
        zeroLineColor: "transparent",
      },
      ticks: {
        padding: 20,
        fontColor: "#9a9a9a"
      }
    }]
  }
};




const temperatureGrafic = new Chart(temp, {
  type: 'line',
      responsive: true,
      data: {
        labels: [],
      datasets: [{
        label: "Temperatura",
        fill: true,
        backgroundColor: gradientStroke,
        borderColor: '#d048b6',
        borderWidth: 2,
        borderDash: [],
        borderDashOffset: 0.0,
        pointBackgroundColor: '#d048b6',
        pointBorderColor: 'rgba(255,255,255,0)',
        pointHoverBackgroundColor: '#d048b6',
        pointBorderWidth: 20,
        pointHoverRadius: 4,
        pointHoverBorderWidth: 15,
        pointRadius: 4,
        data: [],
      }]
      },
  options:{plugins: {
    legend: {
      display: false,
    }}, gradientChartOptionsConfigurationWithTooltipPurple,} 
});
