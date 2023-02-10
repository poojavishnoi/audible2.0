const router = require('express').Router()

const song = require('../models/audio')

router.post("/save", async(req,res) => {
  const newSong = song({
    name: req.body.name,
    imageURL :req.body.imageURL,
    audioURL: req.body.audioURL,
  
  })

  try {
    const savedSong = await newSong.save()
    return res.status(200).send({success: true, song: savedSong})
  } catch (error) {
    return res.status(400).send({success: false, msg:error})
  }
})

router.get("/getOne/:id", async(req,res) => {
  const filter = {_id: req.params.id}
  const data = await song.findOne(filter)
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