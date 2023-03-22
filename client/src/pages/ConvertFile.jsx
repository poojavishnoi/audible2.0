import React from "react";
import { useLocation } from "react-router";
import JSZip from "jszip";
import axios from "axios";
import { useState } from "react";
import img from "../images/img.jpg";
import Music from "../audio.mp3";
import SubtitlePlayer from "./SubtitlePlayer";
import FlipBook from "../components/FlipBook";
import Dropdown from "../components/Dropdown";
import NewFlipBook from "../components/NewFlipBook";

const baseUrl = "http://localhost:4000/";

function ConvertFile() {
  const {
    state: { textValue, extention, file, image },
  } = useLocation();

  const [url, setUrl] = useState([]);
  const [speed, setSpeed] = useState("slow");
  const [srt, setSrt] = useState([]);

  const handleSpeed = (speed) => {
    setSpeed(speed);
  };


  const ConvertTextToSpeech = async (textValue) => {
    try {
      const response = await axios
        .post(
          `${baseUrl}api/convert/coqui`,
          { text: JSON.stringify(textValue) },
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

          console.log(typeof srtText + " srt-text");

          const audio = new Audio(URL.createObjectURL(wavBlob));

          // Set the state to update the URL and SRT text
          setUrl(audio);

          setSrt(srtText);
        })
        .catch((error) => console.error(error));
    } catch {}
  };


  return (
    <div className="">
      <div className=" text-white rounded-3xl mx-10 bg-rose-800 w-11/12 h-screen p-10">
        <div className="flex">
          <div className="mx-20">
            <img
              className=" rounded-3xl w-56  object-contain my-10 "
              src={image ? image : img}
              alt="music"
            />
            <div className="my-4">
              <h1 className=" text-2xl">{file.name}</h1>
              <Dropdown handleSpeed={handleSpeed} />
              <button
                onClick={() => ConvertTextToSpeech(textValue)}
                className="border px-2 my-4 rounded-md cursor-pointer"
              >
                Convert
              </button>
            </div>
          </div>
          
          <NewFlipBook/>

          {/* <div className="mr-20 my-10 w-full rounded-lg p-10 text-xl bg-white text-black">
            <h1 className="">SUBTITLES</h1>
            <p id="subtitles" className="pt-4 m-4 text-2xl tracking-wide">
              <div>
                <div className="w-full h-full">
                   {url && srt && (
                      <SubtitlePlayer audioSrc={Music} subtitleSrc={'sample.srt'} />
                    )} 
                </div>
              </div>
            </p>
          </div> */}

        

        </div>
      </div>
      <div className="p-10 text-center ">
        <button className=" border w-44  text-2xl py-4 px-5 rounded-2xl bg-gray-900 text-white cursor-pointer">
          Save
        </button>
      </div>
    </div>
  );
}

export default ConvertFile;
