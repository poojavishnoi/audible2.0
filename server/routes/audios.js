const router = require('express').Router()
const { log } = require('console');
const multer = require('multer');
const { listeners } = require('../models/audio');
const upload = multer();
const Audio = require('../models/audio')

router.post("/save", upload.fields([{ name: 'audio', maxCount: 1 }, { name: 'srt', maxCount: 1 }]), async(req,res) => {
  const { image, file_name, file, file_type, author_email, quality, text} = req.body;
  console.log("req.body: ", req.body);
  const { audio, srt } = req.files;
  const visibility = true
  const listeners = [{author_email, paused: 0}]
  const audioData = audio[0].buffer.toString('base64');
  const srtData = srt[0].buffer.toString('base64');
  const newAudio = new Audio({
    file_name,
    file,
    file_type,
    image,
    author_email,
    quality,
    visibility,
    listeners,
    audio: audioData,
    srt: srtData,
    text
  });
  console.log("newAudio: ", newAudio);
  try{
    const exists = await Audio.find({file_name: file_name, author_email: author_email})
    if(exists>0){
      console.log("File already exists", exists);
      return res.send({success: false, message: "File already exists"})
    }
    else{
      const savedAudio = await newAudio.save();
      return res.status(200).send({success: true, audio: savedAudio})
    }
    
  }catch(error){
    return res.status(400).send({success: false, msg:error})
  }

  // console.log("srt:-----------------\n", srtFile);
  // const newSong = song({
  //   name: req.body.name,
  //   imageURL :req.body.imageURL,
  //   audioURL: req.body.audioURL,
  
  // })

  // try {
  //   const savedSong = await newSong.save()
  //   return res.status(200).send({success: true, song: savedSong})
  // } catch (error) {
  //   return res.status(400).send({success: false, msg:error})
  // }
})

router.get("/getOwn/:email", async(req,res) => {
  const filter = {author_email: req.params.email}
  const options = {
    _id: true,
    file_name: true,
    image: true,
    author_email: true,
    visibility: true,
    listeners: true,
  }
  const data = await Audio.find(filter, options)
  if(data){
    return res.status(200).send({success: true, audio:data})
  }else{
    return res.status(400).send({success:false, msg: 'Data not found'})
  }
})

router.get("/getPersonalLibrary/:email", async(req,res) => {
  const filter = {visibility: true, listeners: {$elemMatch: {email: req.params.email}}}
  const options = {
    _id: true,
    file_name: true,
    image: true,
    author_email: true,
    visibility: true,
    listeners: true,
  }

  const data = await Audio.find(filter, options);

  if(data){
    return res.status(200).send({success: true, audio: data})
  }else{
    return res.status(400).send({success: false, msg: "Data not found"})
  }
})

router.get("/getPublicLibrary", async(req,res) => {
  const filter = {visibility: true}
  const options = {
    _id: true,
    file_name: true,
    image: true,
    author_email: true,
    visibility: true,
    listeners: true,
  }

  const data = await Audio.find(filter, options);

  if(data){
    return res.status(200).send({success: true, audio: data})
  }else{
    return res.status(400).send({success: false, msg: "Data not found"})
  }
})

router.get("/getBook/:id", async(req,res) => {
  const filter = {_id: req.params.id}
  const options = {
    _id: true,
    file_name: true,
    image: true,
    author_email: true,
    visibility: true,
    listeners: true,
    srt: true,
    audio: true,
    text: true,
  }
  const data = await Audio.findById(filter, options)
  if(data){
    const dhwani = Buffer.from( data.audio, "base64");
    const srt = Buffer.from( data.srt, "base64");
    data.srt = srt.toString('utf-8');
    data.audio = "data:audio/wav;base64," + dhwani.toString('base64');
    // const audioBlob = new Blob([dhwani], { type: "audio/wav" });
    // const responseObj = { success: true, audio: audioBlob, someData: data };
    // return res.status(200).send(responseObj);
    return res.status(200).send({success: true, audio: data})
    }else{
    return res.status(400).send({success:false, msg: 'Data not found'})
  }
})


router.put("/updatePaused/:id", async(req,res) => {
  console.log("req.body: ", req.body);
  const filter = {_id : req.params.id, 'listeners.email': req.body.email}
  const projection = {
    _id: true,
    file_name: true,
    image: true,
    author_email: true,
    visibility: true,
    listeners: true,
  }
  const options = {
    projection,
    upsert:true,
    new: true
  }
  try {
    const result = await Audio.findOneAndUpdate(
      filter,
      {
        $set: {"listeners.$.paused": req.body.paused}
      },
      options
    )

    return res.status(200).send({success: true, data : result})
  } catch (error) {
    return res.status(400).send({success:false, msg:error})
  }
})

router.put("/addListeners/:id", async(req,res) => {
  const filter = {_id : req.params.id}
  const projection = {
    _id: true,
    file_name: true,
    image: true,
    author_email: true,
    visibility: true,
    listeners: true,
  }
  const options = {
    projection,
    upsert:true,
    new: true
  }
  try {
    const result = await Audio.findByIdAndUpdate(
      filter,
      {
        $addToSet: {listeners: req.body.listeners}
      },
      options
    )
    return res.status(200).send({success: true, data : result})
  } catch (error) {
    return res.status(400).send({success:false, msg:error})
  }
})

router.put("/updateVisibility/:id", async(req,res) => {
  const filter = {_id : req.params.id}
  const projection = {
    _id: true,
    file_name: true,
    image: true,
    author_email: true,
    visibility: true,
    listeners: true,
  }
  const options = {
    projection,
    upsert:true,
    new: true
  }
  try {
    const result = await Audio.findByIdAndUpdate(
      filter,
      {
        visibility: req.body.visibility
      },
      options
    )
    return res.status(200).send({success: true, data : result})
  } catch (error) {
    return res.status(400).send({success:false, msg:error})
  }
})

router.delete("/deleteAudio/:id", async(req,res) => {
  const filter = {_id : req.params.id}
  const result = await Audio.deleteOne(filter)
  if(result){
    return res.status(200).send({success: true, msg: "Data deleted successfully", data: result})
  }else{
    return res.status(400).send({success: false, msg: "Data not found"})
  }

})

router.get("/play",(req,res) => {
  res.json("ok")
})

module.exports = router;