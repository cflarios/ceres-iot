const express = require("express");
const app = express();
const path = require("path");
// settings
app.set("port", 4000)
app.set("view engine","ejs")
app.set("views", path.join(__dirname, "views"))
app.engine("html", require("ejs").renderFile)
// routers
app.use(require('./routers/router'))
app.use(express.static(path.join(__dirname, "public")))

module.exports = app;