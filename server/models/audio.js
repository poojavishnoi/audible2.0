const mongoose = require('mongoose')

const AudioSchema = mongoose.Schema({
  file_name: {
    type: String,
    required: true
  },
  file: {
    type: String,
  },
  file_type: {
    type: String,
    required: true
  },
  image: {
    type: String,
  },
  author_email: {
    type: String,
    required: true
  },
  visibility:{
    type: Boolean,
    default: false
  },
  listeners:{
    type: Array,
    default: [{email: {type: String}, paused: {type: Number, default: 0}}]
  },
  audio: {
    type: String,
    required: true
  },
  srt: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true
  },

},{
  timestamps: true
})


module.exports = mongoose.model("audio", AudioSchema)