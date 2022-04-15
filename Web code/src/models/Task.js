const mongoose = require("mongoose");

const sensorSchema = new mongoose.Schema({
  topic:{
    type:String,
    required:true,
    trim:true
  },
  value:{
    type:String,
    required:true,
    trim:true
  }
  
},{
  timestamps:true,
  versionKey:false
})

module.exports = mongoose.model("sensors",sensorSchema);