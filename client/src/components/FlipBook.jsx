// import SubtitlePlayer from "../pages/SubtitlePlayer";
import "../style/flipbook.css";
import '../App.css'
import Music from "../audio.mp3";
import React, { useState, useEffect, useRef } from "react";
import ReactAudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import HTMLFlipBook from "react-pageflip";
import img from "../images/img.jpg";

function FlipBook() {
  const flipbook = useRef();
  const audioRef = useRef(null);
  const [subtitles, setSubtitles] = useState([]);
  const [currentSubtitleIndex, setCurrentSubtitleIndex] = useState(-1);
  const [pages, setPages] = useState([]);
  const [page, setPage] = useState(0);
  const subtitleSrc = "sample.srt";
  const characterLimit = 600;
  const [pageCount, setPageCount] = useState(0);
  useEffect(() => {
    const divElement = flipbook.current;
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

    
    pageDistribution();
  }, [subtitleSrc]);

  const PageCover = (props, ref) => {
    return (
      <div className="page page-cover" ref={flipbook} data-density="hard">
        <div className="page-content">
          <h2>{props.children}</h2>
        </div>
      </div>
    );
  };

  const Page = (props, ref) => {
    console.log(props, "props");
    return (
      <div className="page" ref={flipbook}>
        <div className="page-content">
          <h2 className="page-header">Page header - {props.number + 1}</h2>
          <div className="page-image">
            <img src={img} className="w-96 h-52" alt="flip_image"/>
          </div>
          <div className="page-text">{props.children}</div>
          <div className="page-footer">{props.number + 1}</div>
        </div>
      </div>
    );
  };

  const pageDistribution = () => {
    var pageArray = [];
    var subtitleIndex = 0;
    var pageCount = 0;

    while (subtitles.length > subtitleIndex) {
      var pageFilled = 0;
      var content = [];

      while (characterLimit >= pageFilled && subtitles.length > subtitleIndex) {
        console.log(subtitles[subtitleIndex].text.length, "subtitle length");
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
      console.log(pageArray, "pageArray");
    }
    setPages(pageArray);
  };

  console.log(pages, "pages");

  const TimeInDecimal = (time) => {
    const timeString = time;
    const [hours, minutes, seconds] = timeString?.split(":");
    const milliseconds = parseInt(timeString.split(",")[1]);
    const totalSeconds =
      parseInt(seconds) + parseInt(minutes) * 60 + parseInt(hours) * 3600;
    const timeInSeconds = totalSeconds + milliseconds / 1000;

    return timeInSeconds;
  };

  console.log(subtitles, "subtitles");
  const handleAudioTimeUpdate = (event) => {
    const currentTime = event.target.currentTime;

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

  const currentSubtitle = subtitles[currentSubtitleIndex];

  const onPage = (e) => {
    setPage(e.data);
  };

  return (
    <div className="w-full ">
      <ReactAudioPlayer
        ref={audioRef}
        current
        onListen={handleAudioTimeUpdate}
        src={Music}
        className=" mb-10 w-full"
        controls
      />
      {/* <HTMLFlipBook className=" bg-white text-black" width={300} height={500}>
            <div className="demoPage ">Page 1</div>
            <div className="demoPage">Page 2</div>
            <div className="demoPage">Page 3</div>
            <div className="demoPage">Page 4</div>
        </HTMLFlipBook> */}

      <HTMLFlipBook
        width={550}
        height={733}
        size="stretch"
        minWidth={315}
        maxWidth={1000}
        minHeight={400}
        maxHeight={1533}
        maxShadowOpacity={0.5}
        showCover={true}
        // onChangeOrientation= "portrait"
        onFlip={onPage}
        // onChangeState={this.onChangeState}
        className="demo-book bg-white text-black"
        ref={flipbook}
      >
        <PageCover>BOOK TITLE</PageCover>
        {pages.map((page, index) => {
          return (
            <Page number={index} key={index}>
              {page.content.map((subtitle, index) => {
                return (
                  <div key={index}>
                    {subtitle.text}
                    <br />
                  </div>
                );
              })}
            </Page>
          );
        })}
        <PageCover>THE END</PageCover>
      </HTMLFlipBook>
    </div>
  );
}

export default FlipBook;
