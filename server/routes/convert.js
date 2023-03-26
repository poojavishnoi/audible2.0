const router = require('express').Router()
const request = require("request");
const { PassThrough } = require('stream');
const textToSpeech = require("@google-cloud/text-to-speech");
const client = new textToSpeech.TextToSpeechClient();
const pdfjsLib = require('pdfjs-dist');
const util = require("util");
const fs = require("fs");
const { log, Console } = require('console');

router.post('/coqui', async function(req, res) {
    try{
        // if(req.body.text){
        //     const file = req.files.file;
        //     const buffer = file.data;
        //     const pdfDoc = await pdfjsLib.getDocument(buffer).promise;
          
        //     let text = '';
        //     for (let i = 1; i <= pdfDoc.numPages; i++) {
        //       const page = await pdfDoc.getPage(i);
        //       const content = await page.getTextContent();
        //       text += content.items.map(item => item.str).join(' ');
        //     }
      //   // }
      // console.log("is the text ",text)
      const text = req.body.text
      const speed = req.body.speed
      console.log("body", text);
      const response = await request.post('http://127.0.0.1:5000/tts',
      {json:{text:text,
       speed:speed,
      }}, async (err, res) => {
        if (err) { 
          console.log('Error:', err); 
        } else {
          const resp = await request.get('http://127.0.0.1:5000/delete');
        }
      }
      ).pipe(new PassThrough());
      res.set('Content-Type', 'application/zip');
      res.set('Content-Disposition', 'attachment; filename="audio.zip"');
      response.pipe(res);
    }
    catch(err){
      console.log(err)
    }
});

router.post("/google" ,(req, res) => {
    try{
      const textValue = req.body.text; 
      console.log("converting text::::::::", textValue);
      convertTexttoMp3(textValue);
      res.json({ msg: "Text to speech has completed. Audio file has been saved" });
    }
    catch(err){
      console.log(err)
    }
})

router.post("/summarise", async (req, res) => {
    try{
      const textValue = req.body.text; 
      let summary = '';
      console.log("converting text::::::::");
      const response = await request.post('http://127.0.0.1:5000/summarise',
      {json:{text:textValue}})
      .on('data', (data) => {
        summary += data;
      })
      .on('end', () => {
        console.log("summary", summary);
        res.json({ summary: summary });
      });
    }
    catch(err){
      console.log(err)
    }
})

async function convertTexttoMp3(words) {
    try{

      const text = words 
      //"This is a sample text, that im sending to the server, to test the api, and see if text to speech conversion works";
  
      const request = {
        input: {text: text},
        voice: {languageCode: "en-US", name: 'en-US-Wavenet-A' },
        audioConfig: {audioEncoding: "MP3"},
      };
  
      const [response] = await client.synthesizeSpeech(request);
      const writeFile = util.promisify(fs.writeFile);
      console.log("writing file", typeof(response.audioContent))
      await writeFile("google_output.mp3", response.audioContent, "binary");

      console.log("Audio content written to file: output.wav");

      const resp = await request.post('http://127.0.0.1:5000/transcribe',
      {json:{audio:"google_output.mp3"
      }}
      );
    }
    catch(err){
      console.log(err)
    }  
  }

module.exports = router;