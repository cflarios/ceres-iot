const temp = document.getElementById("tempGrafic").getContext("2d");
const soil = document.getElementById("humSoil").getContext("2d");
const water1 =  document.getElementById("cylGauge1").getContext("2d")
const water2 =  document.getElementById("cylGauge2").getContext("2d")
var gradientStroke = temp.createLinearGradient(0, 230, 0, 50);
gradientStroke.addColorStop(1, "rgba(66,134,121,0.15)");
gradientStroke.addColorStop(0.4, "rgba(66,134,121,0.0)"); //green colors
gradientStroke.addColorStop(0, "rgba(66,134,121,0)"); //green colors



const tankWater1 = new Chart(water1,{
  type: "bar",  
  data :{
    
    labels: [''],
    datasets: [
      {
        label: 'Nivel de agua',
        borderColor: styles.color.alphas[2],
        backgroundColor: styles.color.solids[1],
        data:[],
        borderWidth:1,
        categoryPercentage: 0.77
    },
          
    ]
}, options: {
    maintainAspectRatio: false,
    scaleFontColor: '#fff',
    scales: {
        x: {          
            stacked:true,    
        },
        y:{
          suggestedMax: 100,
        }
    }
}
})
const tankWater2 = new Chart(water2,{
  type: "bar",  
  data :{
    
    labels: [''],
    datasets: [
      {
        label: 'Nivel de agua',
        borderColor: styles.color.alphas[2],
        backgroundColor: styles.color.solids[1],
        data:[],
        borderWidth:1,
        categoryPercentage: 0.77
    },
          
    ]
}, options: {
    maintainAspectRatio: false,
    scaleFontColor: '#fff',
    scales: {
        x: {          
            stacked:true,    
        },
        y:{
          suggestedMax: 100,
        }
    }
}


})

const humiditySoil = new Chart(soil, {
  type: "doughnut",
  data: {
    labels: [],
    datasets: [
      {
        data: [],
        label: "humedad %",
        backgroundColor: ["green",gradientStroke],
        borderColor: "#00d6b4",
        borderWidth: 2,
        borderDash: [],
        borderDashOffset: 0.0,
        
      },
    ],
  },
  options: {
    scales: {
      y: {
        //barPercentage: 0.5,
        /* suggestedMin: 50,
        suggestedMax: 55, */
        ticks: {
          display: true,
        },
      },
      x: {
        //suggestedMin: 0,
        //suggestedMax: 55,
        ticks: {

          display: true,
        },
      },
    },
    legend: {
      display: true
    },
    circumference: 180,
    rotation: -90,
    cutout: 90,
  },
});

const temperatureGrafic = new Chart(temp, {
  type: "line",
  data: {
    labels: [],
    datasets: [
      {
        label: "Temperatura Cº",
        data: [],
        //backgroundColor: styles.color.solids[3],
        //borderColor: styles.color.solids[5],
        backgroundColor: gradientStroke,
        borderColor: "#00d6b4",
        borderWidth: 2,
        borderDash: [],
        borderDashOffset: 0.0,
        pointBackgroundColor: "#00d6b4",
        pointBorderColor: "rgba(255,255,255,0)",
        pointHoverBackgroundColor: "#00d6b4",
        pointBorderWidth: 20,
        pointHoverRadius: 4,
        pointHoverBorderWidth: 15,
        pointRadius: 4,
      },
    ],
  },
  options: {
    legend: {
      display: true
    },
    maintainAspectRatio: false,
    scaleFontColor: "#fff",
    scales: {
      y:{
        /* suggestedMin: 50,
        suggestedMax: 55, */
        ticks: {
          display: true,
        },
      },
      x:{
        suggestedMin: 0,
        suggestedMax: 55,
        ticks: {
          display: true,
        },
      },
    },
  },
});