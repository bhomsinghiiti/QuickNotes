const mongoose = require("mongoose");

//since we need to get data from user into our auth app, we need the following line
const { Schema } = mongoose;

const UserSchema = new Schema({
    name:{
        type: String,
        required: true
    },

    email:{
        type: String,
        required: true,
        unique: true
    },

    password:{
        type: String,
        required: true
    },

    date:{
        type: Date,
        default: Date.now
    },
  });
  
  const User = mongoose.model('user', UserSchema);
  module.exports = User