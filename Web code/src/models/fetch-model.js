var mongoose=require('mongoose');
var db = require('../database');
// create an schema
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
userTable=mongoose.model("sensors",sensorSchema);
        
module.exports={
     
     fetchData:function(callback){
        var userData=userTable.find({});
        userData.exec(function(err, data){
            if(err) throw err;
            return callback(data);
        })
        
     }
}