import React from "react";
import { useLocation } from "react-router";
import { useStateValue } from "../context/StateProvider";
import JSZip from "jszip";
import axios from "axios";
import { useState } from "react";
import { motion } from "framer-motion";
import Dropdown from "../components/Dropdown";
import NewFlipBook from "../components/NewFlipBook";
import Swal from "sweetalert2";
import Boy from '../images/boy.png'
import Music from "../result.mp3";

const baseUrl = "http://localhost:4000/";

function ConvertFile() {
  const {
    state: { name, textValue, extention, file, image },
  } = useLocation();

  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState("English")
  const [lan, setLan] = useState("en")
  const [processing, setProcessing] = useState(false);
  const [saveType, setSaveType]  = useState(false);
  const [audioTime, setAudioTime] = useState(0);
  const [pausedTime, setPausedTime] = useState(audioTime);
  const [{ user }, dispatch] = useStateValue();
  const [summaudio, setSummaudio] = useState([]);
  const [summary, setSummary] = useState([]);
  const [url, setUrl] = useState([]);
  const [speed, setSpeed] = useState("slow");
  const [srt, setSrt] = useState([]);
  const [audioblob, setaudioblob] = useState([]);
  const [isMenu, setIsMenu] = useState(false);

  const handleSpeed = (speed) => {
    setSpeed(speed);
  };


  const ConvertTextToSpeech = async (textValue) => {
    setProcessing(true)
    try {
      const response = await axios
        .post(
          `${baseUrl}api/convert/coqui`,
          {
            text: JSON.stringify(textValue),
            extention: extention,
            speed: speed,
            name: name,
            file: file,
            lan: "en",
          },
          {
            headers: { "Content-Type": "application/json" },
            responseType: "arraybuffer",
          }
        )
        .then(async (resp) => {
          //   const blob = new Blob([resp.data], { type: 'application/zip' });
          //   const zip = new JSZip();
          //   await zip.loadAsync(blob);
          //   const wavFile = zip.file(/\.wav$/i)[0];
          //   if (!wavFile) {
          //     throw new Error('No WAV file found in ZIP archive');
          //   }
          //   const srtFile = zip.file(/\.srt$/i)[0];
          //   if (!srtFile) {
          //     throw new Error('No SRT file found in ZIP archive');
          //   }
          //   setSrt(srtFile)
          //   return await wavFile.async('blob');
          // })
          // .then(wavBlob => {
          //   const audio = new Audio(URL.createObjectURL(wavBlob));
          //   // audio.play();
          //   setUrl(audio)
          const blob = new Blob([resp.data], { type: "application/zip" });
          const zip = await JSZip.loadAsync(blob);

          const wavFile = zip.file(/\.wav$/i)[0];
          const srtFile = zip.file(/\.srt$/i)[0];

          if (!wavFile) {
            throw new Error("No WAV file found in ZIP archive");
          }
          if (!srtFile) {
            throw new Error("No SRT file found in ZIP archive");
          }

          const wavBlob = await wavFile.async("blob");
          const srtText = await srtFile.async("text");
          setaudioblob(wavBlob);
          const acb = URL.createObjectURL(wavBlob)
          const audio = new Audio(acb);
          // Set the state to update the URL and SRT text
          setUrl(audio);
          setSrt(srtText);

          setLoading(false);
          setProcessing(false)
        })
        .catch((error) => console.error(error));
    } catch {}
  };

  const Saveaudioandtext = async (name, speed, user) => {
    try {

      const response = await axios
        .post(
          `${baseUrl}api/convert/summarise`,
          {
            text: JSON.stringify(textValue),
          },
          {
            headers: { "Content-Type": "application/json" },
          }
        )
        .then(async (resp) => {
          setSummaudio(resp.data.summary.audio);
          setSummary(resp.data.summary.text);
        })
        .catch((error) => console.error(error));

      console.log(name, extention);
      const formData = new FormData();
      // Append the audio and zip files to the form data
      formData.append("audio", audioblob, "audio.wav");
      // Append the SRT file to the form data
      formData.append(
        "srt",
        new Blob([srt], { type: "text/plain" }),
        "subtitle.srt"
      );
      formData.append("file_name", name);
      formData.append("author_email", user.user.email);
      formData.append("quality", speed);
      formData.append("file", file);
      formData.append("file_type", extention);
      formData.append("image", image);
      formData.append("text", JSON.stringify(textValue));

      formData.append("summary_audio", summaudio);
      formData.append("summary_text", summary);
      formData.append("language", lan);
      await axios
        .post(`${baseUrl}api/mongi/save`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        .then(async (res) => {
          console.log(res);
          if (res.status === 200 && res.data.success === true) {
            Swal.fire({
              title: "Success!",
              text: "Your file has been saved",
              icon: "success",
              button: "Ok",
            });
          } else {
            if (
              res.data.message === "File already exists" &&
              res.data.success === false
            ) {
              Swal.fire({
                title: "Oops!",
                text: "File already exists",
                icon: "warning",
                button: "Ok",
              });
            } else {
              Swal.fire({
                title: "Error!",
                text: "Something went wrong",
                icon: "error",
                button: "Ok",
              });
            }
          }
        });

      // Send the form data to the backend
      // const blob = new Blob([zipblob], { type: "application/zip" });
      //     const zip = await JSZip.loadAsync(blob);
      //     console.log(zip, "zip");
      // const response = await axios.post(`${baseUrl}api/mongi/save`, {
      //   name: name,
      //   user: user.user,
      //   lob: zip,
      //   quality: speed
      // });
      // console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  const languageHandler = () => {
    if(language == "English"){
      setLanguage("German")
      setLan("ga")
    }else{
      setLanguage("English")
      setLan("en")
    }
  }

  const saveHandler = (e) => {
    setSaveType(() => !saveType)
  }
 
  return (
    <div>
      <div
        className="flex bg-image p-5 items-center">
          <div className="flex ml-10 flex-col items-center ">
          <button
                onClick={languageHandler}
              className={`${language === "English" ? "bg-black text-white" : "bg-white "} md:bottom-0 md:text-sm lg:w-32 text-xl py-3 px-3 h-fit rounded-2xl cursor-pointer`}
            >
              {language}
            </button>
        <div className="relative  mt-10 convert-image flex flex-col justify-between rounded min-w-[20rem] w-[20rem] h-[30rem]">  
          <div className="text-center">
          <h1 className=" text-lg pt-12 md:text-md md:pt-20 lg:text-2xl lg:pt-24 xl:text-3xl xl:pt-28 border-2 ">{name}</h1>
          
          <div className={`${language==="German" ? ' fade-out hidden' : "block fade-in-out" } `} >
          <Dropdown handleSpeed={handleSpeed} />
          </div>
          </div>
          <div className=" flex justify-between items-center">

          {
            loading ? (
              <button
                onClick={() => ConvertTextToSpeech(textValue)}
              className="absolute md:bottom-0 md:text-sm lg:bottom-[34%] lg:left-[35%] lg:text-[1.1rem] lg:w-24 yellow text-xl py-2 px-3 h-fit  rounded-2xl   cursor-pointer"
            >
              Convert
            </button>
            ) : (

                <button
                  onClick={() => Saveaudioandtext(name, speed, user)}
                  className="absolute md:bottom-[63%] md:left-[39%] md:text-sm lg:bottom-[35%] lg:left-[35%] lg:text-[1rem] lg:w-24 yellow text-xl py-1 px-3 h-fit  rounded-2xl   cursor-pointer"
                >
                  Save
                </button>
              
            
            )
          }
            
          </div>

         
        </div>
        <div className="flex">
        <input type="checkbox" onChange={saveHandler} className="mr-2" id="save" name="save"/>
<label className="text-sm" for="save">Click here if you want to save the book publicly</label>
</div>
        </div>
        
      {loading ?  (
        <div className="">
        <div
          role="status"
          className="orange flex flex-col justify-center items-center rounded-3xl mx-10 h-[40rem] mt-10 w-[65rem]  px-10  "
        >
        {
          loading && processing ? (<>
         <svg
            aria-hidden="true"
            class="w-20 h-20 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
          <span className="pt-10 text-2xl text-white">
            Please wait while your file is being processed
          </span> 
          </>
          ):(
            <>
            <p className="text-3xl text-white mb-1">Click on convert to process the text into audio </p>
            <img src={Boy} alt="loading" className="object-fit" />
            </>
          )
        }
         
          </div>
        </div>
      ) : (
        <div className={`fade-in-out text-white rounded-3xl ok mt-4 h-full mx-24 px-10`}>
          <div className="">
            {url && srt && (
              <NewFlipBook setPausedTime={setPausedTime} audioTime={audioTime} audioSrc={url} subtitleSrc={srt} />

            )}
          </div>
          </div>      
          )}
    </div>
    </div>
  );
}

export default ConvertFile;
