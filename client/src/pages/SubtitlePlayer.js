import React, { useState, useEffect, useRef } from "react";
import ReactAudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";

const SubtitlePlayer = ({isFlipped, handleFlip, audioSrc, subtitleSrc }) => {
  // const audioRef = useRef(null);
  // const [subtitles, setSubtitles] = useState([]);
  // const [currentSubtitleIndex, setCurrentSubtitleIndex] = useState(-1);


  // useEffect(() => {

  //   if( typeof(subtitleSrc) !== "object")
  //    {
  //       // // Parse the SRT file into an array of subtitle objects
  //       // const subtitles = subtitleSrc.trim()
  //       //   .split(/\n\s*\n/)

  //       fetch(subtitleSrc)
  //     .then((response) => response.text())
  //     .then((data) => {
  //       // Parse the SRT file into an array of subtitle objects
  //       const subtitles = data
  //         .trim()
  //         .split("\n\n")
  //         .map((subtitle) => {
  //           console.log(subtitle + " awawawawa");
  //           const [index, time, text] = subtitle?.split("\n");
  //           return {
  //             index,
  //             start: TimeInDecimal(time?.split(" --> ")[0]),
  //             end: TimeInDecimal(time?.split(" --> ")[1]),
  //             text,
  //           };
  //         });
  //       setSubtitles(subtitles);
  //     })}
  //   }, [subtitleSrc]);



  // const TimeInDecimal = (time) => {
  //   const timeString = time;
  //   const [hours, minutes, seconds] = timeString?.split(':');
  //   const milliseconds = parseInt(timeString.split(',')[1]);
  //   const totalSeconds = parseInt(seconds) + parseInt(minutes) * 60 + parseInt(hours) * 3600;
  //   const timeInSeconds = totalSeconds + (milliseconds / 1000);

  //   return timeInSeconds
  // };

  // console.log(subtitles, "subtitles");
  // const handleAudioTimeUpdate = (event) => {
  //   const currentTime = event.target.currentTime;

  //   const newSubtitleIndex = subtitles.findIndex((subtitle) => {
  //     return (
  //       subtitle.start <= currentTime && subtitle.end >= currentTime
  //     );
  //   });


  //   if (newSubtitleIndex !== currentSubtitleIndex) {
  //     setCurrentSubtitleIndex(newSubtitleIndex);
  //   }
  // };

  // if (!subtitles) {
  //   return <div>Loading subtitles...</div>;
  // }

  // console.log(currentSubtitleIndex);

  // const currentSubtitle = subtitles[currentSubtitleIndex];

  return (
    <div>

    {/* <ReactAudioPlayer 
      ref={audioRef}
        onListen={handleAudioTimeUpdate}
        src={audioSrc}
        className=" mb-10 w-full"
        controls
    /> */}
     
      {/* <div className=" max-h-60 resize-none overflow-hidden scroll-auto ">
        {subtitles.map((subtitle, index) => (
          <p
            key={index}
           onChange={(e) => {

            e.target.style.height = "auto";
            e.target.style.height = e.target.scrollHeight + "px";
           }}
            className={`p-2 ${index === currentSubtitleIndex ? 'font-bold text-red-800 text-4xl' : 'font-normal'}`}
          >
            {subtitle.text}
          </p>
        ))}
      </div> */}

      
  
    </div>
  );
};

export default SubtitlePlayer;
