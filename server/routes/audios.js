const router = require('express').Router()
const multer = require('multer');
const { listeners } = require('../models/audio');
const upload = multer();
const Audio = require('../models/audio')

router.post("/save", upload.fields([{ name: 'audio', maxCount: 1 }, { name: 'srt', maxCount: 1 }]), async(req,res) => {
  const { image, file_name, file, file_type, author_email, quality, text} = req.body;
  const { audio, srt } = req.files;
  const visibility = true
  const listeners = [author_email]
  // convert audio and srt files to base64
  const audioData = audio[0].buffer.toString('base64');
  const srtData = srt[0].buffer.toString('base64');
  // console.log("audio:---------------\n", audioFile);
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
  try{
    const savedAudio = await newAudio.save();
    return res.status(200).send({success: true, audio: savedAudio})
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

router.get("/getOne/:email", async(req,res) => {
  const filter = {author_email: req.params.email}
  const data = await Audio.find(filter)
  if(data){
    return res.status(200).send({success: true, song:data})
  }else{
    return res.status(400).send({success:false, msg: 'Data not found'})
  }
})

router.get("/getAll", async(req,res) => {
  const options = {
    sort: {
      createdAt:1,
    }
  }

  const data = await song.find();
  console.log(data);
  if(data){
    return res.status(200).send({success: true, song: data})
  }else{
    return res.status(400).send({success: false, msg: "Data not found"})
  }
})

router.put("/update/:id", async(req,res) => {
  const filter = {_id : req.params.id}
  const options = {
    upsert:true,
    new: true
  }

  try {
    const result = await song.findByIdAndUpdate(
      filter,
      {
        name: req.body.name,
        imageURL :req.body.imageURL,
        audioURL: req.body.audioURL,
        audioDuration: req.body.audioDuration 
      },
      options
    )

    return res.status(200).send({success: true, data : result})
  } catch (error) {
    return res.status(400).send({success:false, msg:error})
  }
})

router.delete("/delete/:id", async(req,res) => {
  const filter = {_id : req.params.id}
  const result = await song.deleteOne(filter)
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