const express = require("express");
const router = express.Router();
 
const hi = 89
router.get("/", (req,res)=>{
  res.render('index.html', {title: hi})
}) 
router.get("/contact", (req,res)=>{
  res.render('contact.html', {title: hi})
}) 
module.exports = router;