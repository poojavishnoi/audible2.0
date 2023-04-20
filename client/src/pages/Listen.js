import React, { useEffect } from "react";
import { useLocation } from "react-router";
import { useStateValue } from "../context/StateProvider";
import axios from "axios";
import { useState } from "react";
import NewFlipBook from "../components/NewFlipBook";
import Swal from "sweetalert2";

const baseUrl = "http://localhost:4000/";

function Listen() {
  const [{ user }, dispatch] = useStateValue();
  const [url, setUrl] = useState(null)
  const [srt, setSrt] = useState(null)
  const [audioBook, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [audioTime, setAudioTime] = useState(0);
  const [pausedTime, setPausedTime] = useState(audioTime);
  const {
    state: { id },
  } = useLocation();

useEffect(()  => {
  
  if(audioBook){
    const filteredData = audioBook?.audio?.listeners?.find((item) => item.email === user?.user?.email);
    console.log(filteredData, "filteredData");
    setAudioTime(filteredData?.paused)

  }
  setPausedTime(audioTime)
 } , [audioBook,audioTime, user])

  window.addEventListener('beforeunload', (event) => {
      updatePaused(id)
      // Cancel the event as stated by the standard.
      event.preventDefault();
      // Chrome requires returnValue to be set.
      event.returnValue = '';
      
    })

  // window.addEventListener('beforeunload', (event) => {
  //   updatePaused(id)
  //   // Cancel the event as stated by the standard.
  //   event.preventDefault();
  //   // Chrome requires returnValue to be set.
  //   event.returnValue = '';
    
  // });

  const updatePaused = async (id) => {
    console.log("clicked", id);

    try {
      axios.put(`${baseUrl}api/mongi/updatePaused/${id}`, {
          email: "pooja.k.vishnoi@gmail.com",
          paused: `${pausedTime?.toFixed(2)}`,
        
      });
    } catch (error) {
      console.log(error);
    }
  };

  console.log(audioTime, "audioTime");
  console.log(pausedTime, "pausedTime");

  const getAudioBook = async () => {
    if (user != null || user !== undefined) {
      try {
        if (loading) {
          const response = await fetch(`${baseUrl}api/mongi/getBook/${id}`)
          const data = await response.json()
          console.log(data, "data");
          const audioBlob = data.audio.audio;
          console.log(data.audio.srt, "srt");
          const srtText = data.audio.srt;
          setUrl(audioBlob);
          setSrt(srtText);
          setBooks(data)
          setLoading(false)
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  

  useEffect(() => {
    try {
      if (audioBook == null || audioBook === undefined) {
        setLoading(true);
      }
      getAudioBook();
      
      
    } catch (error) {
      console.log(error);
    }
  }, [user]);

  

  return (
    <div className="flex flex-col items-center bg-image p-10">
      <h1 className=" text-4xl  py-4 ">{audioBook.audio?.file_name}</h1>

      <div className=" text-white rounded-3xl mx-10 ok mt-4 w-11/12 h-full px-10">
        <div className="  justify-center">
          { srt && (
            <NewFlipBook audioSrc={url} subtitleSrc={srt} />
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

        {loading ? (
          <div className="">
            <div
              role="status"
              className="orange flex flex-col justify-center items-center rounded-3xl mx-10 h-full mt-10 w-[77rem]  px-10  "
            >
              <>
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
            </div>
          </div>
        ) : (
          <div
            className={`fade-in-out text-white rounded-3xl mx-10 ok mt-4 w-11/12 h-full px-10`}
          >
            <div className="  justify-start">
              <NewFlipBook setPausedTime={setPausedTime} audioTime={audioTime} audioSrc={audioBook?.audio?.audio} subtitleSrc={audioBook?.audio?.srt} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Listen;
