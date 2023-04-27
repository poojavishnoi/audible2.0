import Music from "../audio.mp3";
import React, { useState, useEffect, useRef } from "react";
import ReactAudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import FlipPage from "react-flip-page";


export default function NewFlipBook( {setPausedTime,audioTime, audioSrc, subtitleSrc }) {

  const audioRef = useRef(null);
  const [subtitles, setSubtitles] = useState([]);
  const [currentSubtitleIndex, setCurrentSubtitleIndex] = useState(-1);
  const [pages, setPages] = useState([]);
  const [time, setTime] = useState(0);
  const characterLimit = 600;
  const [duration, setDuration] = useState('');

console.log(audioTime, "audioTime");

  useEffect(() => {
    if (typeof subtitleSrc !== "object") {
      // // Parse the SRT file into an array of subtitle objects
      // const subtitles = subtitleSrc.trim()
      //   .split(/\n\s*\n/)

      fetch(subtitleSrc)
        .then((response) => response.text())
        .then((data) => {
          // Parse the SRT file into an array of subtitle objects
          const subtitles = data
            .trim()
            .split("\n\n")
            .map((subtitle) => {
              const [index, time, text] = subtitle?.split("\n");
              return {
                index,
                start: TimeInDecimal(time?.split(" --> ")[0]),
                end: TimeInDecimal(time?.split(" --> ")[1]),
                text,
              };
            });

          setSubtitles(subtitles);
          });
    }

  },[]);
useEffect(() => { 
  if(typeof audioSrc !== "object"){
    setDuration(`data:audio/wav;base64,${audioSrc}`)
  }
  else{
    setDuration(audioSrc.src)

  }
  subtitles? pageDistribution() : <>  </>
}, [subtitles, audioSrc]);


console.log(pages, "pages");

useEffect(() => {
  // Initialize currentPageIndex to 0
  let currentPageIndex = 1;

  // Loop through each page in the array
  for (let i = 0; i < pages.length; i++) {
    const pageStartTime = pages[i]?.content[0].start; // Get the start time of the first element in the page's content array

    // If the current time is greater than or equal to the end time of the current page, update currentPageIndex to the next page index
    if (time >= pages[i]?.content.slice(-1)[0].end) {
      currentPageIndex = i + 1;
    }
    // If the current time is less than the start time of the current page and the current page is not the first page, update currentPageIndex to the previous page index
     if (i > 0 && time < pageStartTime) {
      currentPageIndex = i - 1;
      break;
    }
  }
  console.log(  currentPageIndex, "currentPageIndex");

  setTimeout(() => {
    audioRef.current.gotoPage(currentPageIndex);

  }, 100);
    
}, [time, pages, audioRef]);



  const pageDistribution = () => {
    var pageArray = [];
    var subtitleIndex = 0;
    var pageCount = 1;

    while (subtitles.length > subtitleIndex) {
      var pageFilled = 0;
      var content = [];

      while (characterLimit >= pageFilled && subtitles.length > subtitleIndex) {
        if (
          subtitles[subtitleIndex].text.length + pageFilled <
          characterLimit
        ) {
          pageFilled += subtitles[subtitleIndex].text.length;

          content.push(subtitles[subtitleIndex]);

          subtitleIndex++;
        } else {
          break;
        }
      }

      pageArray.push({
        pageCount,
        content,
      });

      pageCount++;
    }
    setPages(pageArray);
  };


  const TimeInDecimal = (time) => {

    const timeString = time;
    const [hours, minutes, seconds] = timeString?.split(":");
    const milliseconds = parseInt(timeString.split(",")[1]);
    const totalSeconds = parseInt(seconds) + parseInt(minutes) * 60 + parseInt(hours) * 3600;
    const timeInSeconds = totalSeconds + milliseconds / 1000;

    return timeInSeconds;
  };

  const handleAudioTimeUpdate = (event) => {
    const currentTime = event.target.currentTime;
    setPausedTime(currentTime)
    setTime(currentTime);
    const newSubtitleIndex = subtitles.findIndex((subtitle) => {
      return subtitle.start <= currentTime && subtitle.end >= currentTime;
    });

    if (newSubtitleIndex !== currentSubtitleIndex) {
      setCurrentSubtitleIndex(newSubtitleIndex);
    }

  };


  if (!subtitles) {
    return <div>Loading subtitles...</div>;
  }

  // const handleLoadMetadata = (meta) => {
  //   const {duration} = meta.target;
  //   setDuration(duration);
  // }

  const handlePlayPause = (e) => {
    e.target.currentTime = audioTime;

  }
 
  const currentSubtitle = subtitles[currentSubtitleIndex];

  return (
    <div className=" flex flex-col items-center pb-10 w-[93%] h-full relative rounded-md  pt-5">
      <ReactAudioPlayer
        ref={audioRef}
        current
        onListen={handleAudioTimeUpdate}
        //  src= {`data:audio/wav;base64,${audioSrc}`}
        src={audioSrc}
        // src={duration}
        type="audio/wav"
        //onLoadedMetaData={handleLoadMetadata}
        className="mb-4 "
        onLoadStart={handlePlayPause}
        controls
        autoPlay = {false}
      />

    

    <div >
      <FlipPage
        ref={audioRef}
        flipOnTouchZone={0.8}
        uncutPages={true}
        orientation="horizontal"
        // responsive={true}
        className="flip"
        width={1500}
        style={{
          padding: "0",
          margin: "0",
        }}
        showTouchHint
        height={720}
        animationDuration="1000"
      >
     

        {pages.map((page, pindex) => (
          <article
            key={pindex}
            className="p-7 relative text-center  flex flex-col text-black"
          >

            {page.content.map((subtitle, index) => {
            
              return (
                <div className=  " md:w-[45%] text-left">
                  <p
                    key={index}
                    className={`p-2 fade-in-out ${
                      subtitle.text === currentSubtitle?.text
                        ? "font-bold text-red-800 text-3xl"
                        : "font-normal text-xl"
                    }`}

                    
                  >
                    {subtitle?.text}
                  </p>
                </div>
              );
            })}

            <div className="absolute right_image bg-white left-[50%] top-0 ">
              <img
                className="object-cover h-full object-center py-5 px-10"
                src="https://images.pexels.com/photos/3662839/pexels-photo-3662839.jpeg?auto=compress&cs=tinysrgb&w=1600"
                alt=""
              />
            </div>
          </article>
        ))}

     

      </FlipPage>
      </div>
    </div>
  );
}


// className="w-1/2 text-left  "