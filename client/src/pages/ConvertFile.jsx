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

const baseUrl = "http://localhost:4000/";

function ConvertFile() {
  const {
    state: { name, textValue, extention, file, image },
  } = useLocation();

  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [saveType, setSaveType]  = useState("personal");


  console.log(saveType);

  const [{ user }, dispatch] = useStateValue();

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

          setLoading(false);
          setProcessing(false)
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
    <div>
      <div
        className="flex bg-image p-10 "
      >
        <div className="relative ml-10 h-[50rem] mt-10 convert-image p-4  flex flex-col justify-between rounded  w-[40rem] ">
          <div className="text-center pr-20">
          <h1 className=" text-5xl pt-36 border-2 ">{name}</h1>
          <Dropdown handleSpeed={handleSpeed} />
          </div>

          <div className="flex  justify-between items-center">

          {
            loading ? (
              <button
                onClick={() => ConvertTextToSpeech(textValue)}
              className="absolute border bottom-64 left-48 yellow w-40 text-xl py-2 px-3 h-fit  rounded-2xl   cursor-pointer"
            >
              Convert
            </button>
            ) : (
              <div
              onMouseEnter={() => setIsMenu(true)}
              onMouseLeave={() => setIsMenu(false)}
              className="relative "
            >
              <div className=" text-center text-white ">
                <button
                  onClick={() => Saveaudioandtext(name, speed, user)}
                  className="relative border bottom-64 left-44 yellow w-40 text-xl py-2 px-3 h-fit  rounded-2xl cursor-pointer"
                >
                  Save
                </button>
              </div>

              {isMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 50 }}
                  className="absolute z-10  flex flex-col p-3 gap-2 top-[-14rem] left-72  w-44 cursor-pointer bg-gray-50 shadow-lg rounded-lg backdrop-blur-sm"
                >
                  <div>
                    <p onClick={() => setSaveType("public")} className=" text-black text-lg  hover:font-semibold duration-150 transition-all ease-in-out">
                      Public
                    </p>
                  </div>
                  <hr />
                  <div>
                    <p onClick={() => setSaveType("personal")}  className="text-black text-lg hover:font-semibold duration-150 transition-all ease-in-out">
                      Personal
                    </p>
                  </div>
                </motion.div>
              )}
            </div>
            )
          }
            
          </div>
         
        </div>
        
      {loading ?  (
        <div className="">
        <div
          role="status"
          className="orange flex flex-col justify-center items-center rounded-3xl mx-10 h-full mt-10 w-[77rem]  px-10  "
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
            <p className="text-3xl text-white mb-10">Click on convert to process the text into audio </p>
            <img src={Boy} alt="" />
            </>
          )
        }
         
          </div>
        </div>
      ) : (
        <div className={`fade-in-out text-white rounded-3xl mx-10 ok mt-4 w-11/12 h-full px-10`}>
          <div className="  justify-start">
            {url && srt && (
              <NewFlipBook audioSrc={url.src} subtitleSrc={srt} />
            )}
          </div>
          </div>      )}
    </div>
    </div>
  );
}

export default ConvertFile;
