const express = require("express");
const router = express.Router();
const Task = require("../models/Task");
//////

/// sockets
router.get("/", (req, res) => {
  res.render("index.html", { title: "Ceres_IoT" });
})
router.get("/RealTimeDashboard", (req, res) => {
  res.render("dashboard.html", { title: "Real-Time Dashboard Ceres_IoT" });
});
 router.get("/historyDashboard", (req, res) => {
 /*  let tasks = await Task.find({topic:"ceres/sensor/ambiente/humedad"}).limit(250).lean(); 
  console.log(tasks.length);
  /* res.json(tasks) */
   /*io.emit("temp", tasks); */
  res.render("historydash.html", {title: "History Dashboard Ceres_IoT"});
}); 

module.exports.router = router;

