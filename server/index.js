const express = require("express")
const app = express()
const {default: mongoose} = require("mongoose")
const cors = require('cors')
const gTTS = require("gtts");
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
  console.log("converting text::::::::", textValue);

  async function convertTextToMp3() {
    var gtts = new gTTS(textValue, "en");
    gtts.save("result.mp3", function (err, res) {
      console.log("loading..");
      if (err) {
        throw new Error(err);
      }
      console.log(`Success! Open file output.mp3 to hear result.`);
      
    })
  }
  convertTextToMp3();
  res.json({ msg: "Text to speech has completed. Audio file has been saved" });
});

app.listen(4000, console.log("Listening to port 4000."))