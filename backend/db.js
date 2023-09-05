const mongoose = require("mongoose");


const connectToMongo =() =>{
  mongoose.connect("mongodb://127.0.0.1:27017/inotebook") 
  .then(()=> console.log("connection to mongoDB is successful"))
  .catch((err) => {console.log(err);});
}

module.exports = connectToMongo;

