const mongoose = require('mongoose')

const AudioSchema = mongoose.Schema({
  name:{
    type: String,
    required: true
  },
  imageURL: {
    type: String,
    required: true
  },
  audioURL: {
    type: String,
    required: true
  },
 
},{
  timestamps: true
})


module.exports = mongoose.model("audio", AudioSchema)