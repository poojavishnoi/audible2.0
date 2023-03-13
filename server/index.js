const express = require("express")
const app = express()
const {default: mongoose} = require("mongoose")
const cors = require('cors')
const gTTS = require("gtts");
const fs = require("fs");
const util = require("util");
const axios = require('axios')
const { Readable } = require('stream');
const AdmZip = require('adm-zip');
const request = require("request");
const { PassThrough } = require('stream');

const textToSpeech = require("@google-cloud/text-to-speech");
const client = new textToSpeech.TextToSpeechClient();
require("dotenv/config")

app.use(cors({origin:true}))
app.use(express.json())

app.get('/', (req, res) => {
  return res.json('hi')
})

const userRoute = require('./routes/auth')
app.use("/api/users/", userRoute)

const audioRoute = require('./routes/audios')
app.use("/api/audios/", audioRoute )

const convertRoute = require('./routes/convert')
app.use("/api/convert/", convertRoute )

mongoose.set('strictQuery', false);
mongoose.connect(process.env.DB_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}
)
mongoose.connection
.once("open", () => console.log("connected"))
.on("error", (error) => {
  console.log(error);
})

app.post("/api/convertfile" ,(req, res) => {
  
  const { textValue } = req.body; 
  // console.log("converting text::::::::", textValue);

  async function convertTextToMp() {
    var gtts = new gTTS(textValue, "en");
    gtts.save("result.mp3", function (err, res) {
      console.log("loading..");
      if (err) {
        throw new Error(err);
      }
      console.log(`Success! Open file output.mp3 to hear result.`);
      
    })
  }
  convertTextToMp();
  res.json({ msg: "Text to speech has completed. Audio file has been saved" });
});

// app.post('/home', async function(req, res) {
//   try{
//     const response = await axios.post('http://127.0.0.1:5000/tts',
//     {text:"This is a sample text, that im sending to the server, to test the api, and see if text to speech conversion works",
//      speed:"fast"
//     },
//     ).then(response = async ()=> {
//       await res.set('Content-Type', 'application/zip');
//       await res.set('Content-Disposition', 'attachment; filename="audio.zip"');
//       await res.send(new Buffer.from(response.data, 'binary'));

      // const zip = new AdmZip(response.data);
      // const zipEntries = zip.getEntries();
      // const srtEntry = zipEntries.find(entry => entry.name.endsWith('.srt'));
      // const wavEntry = zipEntries.find(entry => entry.name.endsWith('.wav'));
      // console.log(srtEntry);
      // console.log(wavEntry);
      // const srtBuffer = srtEntry.getData();
      // const wavBuffer = wavEntry.getData();
      // res.set('Content-Type', 'application/zip');
      // res.set('Content-Disposition', 'attachment; filename="audio.zip"');
      // res.write(srtBuffer);
      // res.write(wavBuffer);
      // res.end();
      
      // const writer = fs.createWriteStream('output.wav');
      // const readableStream = new Readable();
      // readableStream.push(Buffer.from(response.data));
      // readableStream.push(null);
      // const stream = readableStream.pipe(writer);
      // stream.on('finish', () => {
      //   console.log('File downloaded successfully.');
      // });

    // const audioData = response.data[0];
    // const transcriptData = response.data[1];

    // const audioWriter = fs.createWriteStream('output.wav');
    // const audioStream = new Readable();
    // audioStream.push(Buffer.from(audioData));
    // audioStream.push(null);
    // const audioPipe = audioStream.pipe(audioWriter);
    // audioPipe.on('finish', () => {
    //   console.log('Audio file downloaded successfully.');
    // });

    // const transcriptWriter = fs.createWriteStream('output.srt');
    // const transcriptStream = new Readable();
    // transcriptStream.push(Buffer.from(transcriptData));
    // transcriptStream.push(null);
    // const transcriptPipe = transcriptStream.pipe(transcriptWriter);
    // transcriptPipe.on('finish', () => {
    //   console.log('Transcript file downloaded successfully.');
    // });
    
    // })
    // .catch(error => {
    //   console.log(error);
    // });
    // const buffer = Buffer.from(response.data, 'binary');
    // fs.writeFileSync('output.wav', bufferfunction(err));
    // res.status(200).json({ message: 'Audio file saved successfully!' });
    
    // // fs.writeFileSync('output.wav', response.data, { encoding: null });

    // res.status(200).json({ msg: "success" });
    
    // .then(response => {
    //   // Convert the response data to an audio file
    //   const audio = Buffer.from(response.data, 'binary');
    //   fs.writeFile('output.wav', audio, 'binary', function(err) {
    //     if(err) {
    //       console.log(err);
    //       res.status(500).json({ error: 'Internal server error' });
    //     } else {
    //       console.log('The file was saved!');
    //       res.status(200).json({msg: 'success'});
    //     }
    //   });
    // })
    // .catch(error => {
    //   console.log(error);
    //   res.status(500).json({ error: 'Internal server error' });
    // });
//   }
//   catch(err){
//     console.log(err)
//   }
// });

//------------------------------------------------------------
//this one works
// app.post('/home', async function(req, res) {
//   try{
//     const text = req.body.text
//     const response = await request.post('http://127.0.0.1:5000/tts',
//     {json:{text:text,
//      speed:"fast"
//     }}
//     ).pipe(new PassThrough());

//     res.set('Content-Type', 'application/zip');
//     res.set('Content-Disposition', 'attachment; filename="audio.zip"');
//     response.pipe(res);
//   }
//   catch(err){
//     console.log(err)
//   }
// });
//------------------------------------------------------------

// app.post('/home', function(req, res) {
//   req.text=JSON.stringify("this is text")
//   console.log("Request received")
//   request('http://127.0.0.1:5000/tts', function (error, response, body) {
//       console.error('error:', error); // Print the error
//       console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
//       console.log('body:', body); // Print the data received
//       res.send(body); //Display the response on the website
//     });      
// });

// async function listVoices(languageCode) {

//   const client = new textToSpeech.TextToSpeechClient();

//   const [result] = await client.listVoices({languageCode});
//   const voices = result.voices;

//   voices.forEach((voice) => {
//     console.log(`${voice.name} (${voice.ssmlGender}): ${voice.languageCodes}`);
//   });
// }

// listVoices('en');

//------------------------------------------------------------
//this one works
// app.post("/google/convertfile" ,(req, res) => {
//   try{
//     const textValue = req.body.text; 
//     console.log("converting text::::::::", textValue);
//     convertTexttoMp3(textValue);
//     res.json({ msg: "Text to speech has completed. Audio file has been saved" });
//   }
//   catch(err){
//     console.log(err)
//   }
// })

// async function convertTexttoMp3(words) {
//   try{

//     const text = words 
//     //"This is a sample text, that im sending to the server, to test the api, and see if text to speech conversion works";

//     const request = {
//       input: {text: text},
//       voice: {languageCode: "en-US", name: 'en-US-Wavenet-A' },
//       audioConfig: {audioEncoding: "MP3"},
//     };

//     const [response] = await client.synthesizeSpeech(request);
//     const writeFile = util.promisify(fs.writeFile);
//     await writeFile("google_output.mp3", response.audioContent, "binary");
//     console.log("Audio content written to file: output.wav");
//   }
//   catch(err){
//     console.log(err)
//   }  
// }
//------------------------------------------------------------


app.listen(4000, console.log("Listening to port 4000."))