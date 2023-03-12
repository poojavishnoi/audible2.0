import React from "react";
import { useLocation } from "react-router";
import img from "../images/img.jpg";
import { convertTextToSpeech } from "../api";
import Music from "../audio.mp3";
import SubtitlePlayer from "./SubtitlePlayer";

function ConvertFile() {
  const {
    state: { textValue },
  } = useLocation();


  return (
    <div className="">
      <div className=" text-white rounded-3xl h-fit mx-10 bg-rose-800	  p-10">
        <div className="flex">
          <div className="mx-20 my-10">
            <img
              className="w-96 rounded-3xl object-contain my-10 "
              src={img}
              alt="music"
            />
            <div className="m-4">
              <h1 className=" text-4xl">Alag Aasmaan</h1>
              <h1>- Anuv Jain</h1>
              <button
                onClick={() => convertTextToSpeech(textValue)}
                className="border px-2 my-4 rounded-md cursor-pointer"
              >
                Convert
              </button>
            </div>
          </div>
          <div className="mr-20 my-10 w-full rounded-lg p-10 text-xl bg-white text-black overflow-y-scroll">
            <h1 className="">SUBTITLES</h1>
            <p id="subtitles" className="pt-4 m-4 text-2xl tracking-wide">
              <div>
                <div><SubtitlePlayer
        audioSrc={Music}
        subtitleSrc='sample.srt'
      /></div>
              </div>
            </p>
          </div>
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