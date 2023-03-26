import React from "react";
import { useLocation } from "react-router";
import { useStateValue } from "../context/StateProvider";
import JSZip from "jszip";
import axios from "axios";
import { useState } from "react";
import img from "../images/img.jpg";
import Music from "../audio.mp3";
import { motion } from "framer-motion";
import SubtitlePlayer from "./SubtitlePlayer";
import Dropdown from "../components/Dropdown";
import NewFlipBook from "../components/NewFlipBook";
import Swal from "sweetalert2";
const baseUrl = "http://localhost:4000/";

function ConvertFile() {
  const {
    state: { name, textValue, extention, file, image },
  } = useLocation();



  const [{ user }, dispatch] = useStateValue();

  const [url, setUrl] = useState([]);
  const [speed, setSpeed] = useState("slow");
  const [srt, setSrt] = useState([]);
  const [audioblob, setaudioblob] = useState([]);
  const [isMenu, setIsMenu] = useState(false);

  const handleSpeed = (speed) => {
    setSpeed(speed);
  };

  // console.log(user, "user");

  const ConvertTextToSpeech = async (textValue) => {
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
          console.log(typeof srtText + " srt-text");

          const audio = new Audio(URL.createObjectURL(wavBlob));

          // Set the state to update the URL and SRT text
          setUrl(audio);
          setSrt(srtText);
        })
        .catch((error) => console.error(error));
    } catch {}
  };

  const Saveaudioandtext = async (name, speed, user) => {
    try {
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
      console.log(formData, "formdata");
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

  return (
    <div className="flex  bg-image p-10">
      <div className=" ml-10 h-96 mt-10 bg-black p-4 bg-opacity-20 backdrop-blur-md rounded drop-shadow-2xl w-[30rem] ">
        <h1 className=" text-5xl border-2 text-white">{name}</h1>
        <Dropdown handleSpeed={handleSpeed}/>

        <div className="flex mt-40 justify-between">

        <div
          onMouseEnter={() => setIsMenu(true)}
          onMouseLeave={() => setIsMenu(false)}
          className="relative align-end"
        >
        <div className=" text-center text-white ">
            <button
              onClick={() => Saveaudioandtext(name, speed, user)}
              className=" border w-40 text-xl py-2 orange px-3 rounded-2xl bg-gray-900  cursor-pointer"
            >
              Save
            </button>
          </div>

          {isMenu && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="absolute z-10  flex flex-col p-3 gap-2  ml-20 w-44 cursor-pointer bg-gray-50 shadow-lg rounded-lg backdrop-blur-sm"
            >
              <div >
                <p className=" text-base text-black text-lg  hover:font-semibold duration-150 transition-all ease-in-out">
                  Public
                </p>
              </div>
            <hr />
              <div>
                <p className=" text-base text-black text-lg hover:font-semibold duration-150 transition-all ease-in-out">
                  Personal
                </p>
              </div>
            </motion.div>
          )}


          
          </div>

          <button
              onClick={() => Saveaudioandtext(name, speed, user)}
              className=" border  yellow w-40 text-xl py-2 px-3 h-fit  rounded-2xl bg-gray-900  cursor-pointer"
            >
              Convert
            </button>
            </div>
        {/* <button
                onClick={() => ConvertTextToSpeech(textValue)}
                className="border px-2 my-4 rounded-md cursor-pointer"
              >
                Convert
              </button> */}
      </div>
      <div className=" text-white rounded-3xl mx-10 ok mt-4 w-11/12 h-full px-10">
        <div className="  justify-start">
          {url && srt && (
            <NewFlipBook audioSrc={Music} subtitleSrc={"sample.srt"} />
          )}
        </div>
        {/*}
        <div className="my-4 text-black">
              <h1 className=" text-2xl">{name}</h1>
              {/* <Dropdown handleSpeed={handleSpeed}/> */}
        {/* <button
                onClick={() => ConvertTextToSpeech(textValue)}
                className="border px-2 my-4 rounded-md cursor-pointer"
              >
                Convert
              </button> 
            </div> */}

       
          {/* <a href="/library">
      <button className="py-2 px-4 mr-4 text-sm yellow rounded-md text-small">Listen now</button>
    </a>
    <img className="w-12 rounded-full cursor-pointer" src={user?.user.imageURL} alt="userrProfile" referrerPolicy='no-referrer'/>
    
     */}

          {/* <div className="p-6 text-center ">
            <button
              onClick={() => Saveaudioandtext(name, speed, user)}
              className=" border w-40 text-xl py-2 px-3 rounded-2xl bg-gray-900  cursor-pointer"
            >
              Save
            </button>
          </div> */}

         
      </div>
    </div>
  );
}

export default ConvertFile;
