const router = require('express').Router()
const request = require("request");
const { PassThrough } = require('stream');
const textToSpeech = require("@google-cloud/text-to-speech");
const client = new textToSpeech.TextToSpeechClient();
const pdfjsLib = require('pdfjs-dist');

router.post('/coqui', async function(req, res) {
    try{
        if(req.body.text){
            const file = req.files.file;
            const buffer = file.data;
            const pdfDoc = await pdfjsLib.getDocument(buffer).promise;
          
            let text = '';
            for (let i = 1; i <= pdfDoc.numPages; i++) {
              const page = await pdfDoc.getPage(i);
              const content = await page.getTextContent();
              text += content.items.map(item => item.str).join(' ');
            }
        }
      console.log("is the text ",text)
      // const text = req.body.text
      // const response = await request.post('http://127.0.0.1:5000/tts',
      // {json:{text:text,
      //  speed:"fast"
      // }}
      // ).pipe(new PassThrough());
  
      // res.set('Content-Type', 'application/zip');
      // res.set('Content-Disposition', 'attachment; filename="audio.zip"');
      // response.pipe(res);
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
      await writeFile("google_output.mp3", response.audioContent, "binary");
      console.log("Audio content written to file: output.wav");
    }
    catch(err){
      console.log(err)
    }  
  }

module.exports = router;