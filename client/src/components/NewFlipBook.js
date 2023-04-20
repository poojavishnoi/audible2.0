import Music from "../audio.mp3";
import React, { useState, useEffect, useRef } from "react";
import ReactAudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import FlipPage from "react-flip-page";

export default function NewFlipBook({audioSrc, subtitleSrc }) {

  const audioRef = useRef(null);
  const [subtitles, setSubtitles] = useState([]);
  const [currentSubtitleIndex, setCurrentSubtitleIndex] = useState(-1);
  const [pages, setPages] = useState([]);
  const [time, setTime] = useState(0);
  const characterLimit = 600;
  const [duration, setDuration] = useState(0);

  const [audioStarted, setAudioStarted] = useState(false);
  const [pageCover, setPageCover] = useState(true);
  useEffect(() => {
    if (typeof subtitleSrc !== "object") {
      // Parse the SRT file into an array of subtitle objects
      const subtitles = subtitleSrc.trim()
        .split(/\n\s*\n/)            
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
        };
    

  },[]);
useEffect(() => { 
  subtitles? pageDistribution() : <>  </>
}, [subtitles]);

  useEffect(() => {

    for (let index = 0; index < pages.length; index++) {

     if (time > pages[index].content.slice(-1)[0].end) {
        audioRef.current.gotoNextPage();
      }
      if (time < pages[index].content[0].start) {
        audioRef.current.gotoPreviousPage();
      }
    }
  }, [time, pages]);


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

  const handleLoadMetadata = (meta) => {
    const {duration} = meta.target;
    setDuration(duration);
  }

  const currentSubtitle = subtitles[currentSubtitleIndex];

  return (
    <div className=" flex flex-col items-center pb-10  h-full relative rounded-md  pt-5">
      <ReactAudioPlayer
        ref={audioRef}
        current
        onListen={handleAudioTimeUpdate}
        src= {`data:audio/wav;base64,${audioSrc}`}
        type="audio/wav"
        onLoadedMetaData={handleLoadMetadata}
        className="mb-5 w-full "
        controls
      />


      <FlipPage
        ref={audioRef}
        flipOnTouchZone={0.8}
        uncutPages={true}
        orientation="horizontal"
        width={1260}
        className="flip"
        style={{
          padding: "0",
          margin: " 0",
        }}
        showTouchHint
        height={720}
        animationDuration="1000"
      >
        
      

        {pages.map((page, pindex) => (
          <article
            key={pindex}
            className="p-7 relative text-center flex flex-col text-black"
          >

            {page.content.map((subtitle, index) => {
            
              return (
                <div className= "w-1/2 text-left">
                  <p
                    key={index}
                    className={`p-2 ${
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

            <div className="absolute right_image bg-white left-1/2 top-0 ">
              <img
                className="object-contain object-center h-full pt-5 pb-5"
                src="https://images.pexels.com/photos/3662839/pexels-photo-3662839.jpeg?auto=compress&cs=tinysrgb&w=1600"
                alt=""
              />
            </div>
          </article>
        ))}

     

      </FlipPage>
    </div>
  );
}


// className="w-1/2 text-left  "