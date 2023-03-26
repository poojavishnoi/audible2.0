import React, {useEffect} from "react";
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

function Listen() {

  const [{ user }, dispatch] = useStateValue();
  const [audioBook, setBooks] = useState([])
  const [loading, setLoading] = useState(true)



  const {
    state: { id },
  } = useLocation();

  const getAudioBook = async () => {
    if (user != null || user !== undefined) {
      try {
        // console.log(user.user.email, "user")
        if (loading) {
          const response = await fetch(`${baseUrl}api/mongi/getBook/${id}`)
          const data = await response.json()
          // for (let i = 0; i < data.audio.length; i++) {
          //   data.audio[i].summa = false
          // }
          console.log(data, "data");
          setBooks(data)
          setLoading(false)
        }
      } catch (error) {
        console.log(error)
      }
    }
  }

  useEffect(() => {
    try {
      if (audioBook == null || audioBook === undefined) {
        setLoading(true)
      }
      getAudioBook()
    } catch (error) {
      console.log(error)
    }
  }, [user])


  return (
    <div className="flex flex-col items-center bg-image p-10">

<h1 className=" text-4xl  py-4 ">name</h1>
      {/* <div className=" ml-10 flex justify-between w-3/5 items-center ">
        <h1 className=" text-4xl border-2 ">{name}</h1>

        <div
          onMouseEnter={() => setIsMenu(true)}
          onMouseLeave={() => setIsMenu(false)}
          className="items-center relative"
        >
        <div className="px-6 text-center text-white ">
            <button
              onClick={() => Saveaudioandtext(name, speed, user)}
              className=" border w-40 text-xl py-2 px-3 rounded-2xl bg-gray-900  cursor-pointer"
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
        {/* <Dropdown handleSpeed={handleSpeed}/> */}
        {/* <button
                onClick={() => ConvertTextToSpeech(textValue)}
                className="border px-2 my-4 rounded-md cursor-pointer"
              >
                Convert
              </button> */}
      {/* </div>  */}
      
      <div className=" text-white rounded-3xl mx-10 ok mt-4 w-11/12 h-full px-10">
        <div className="  justify-center">
          {/* {url && srt && ( */}
            <NewFlipBook audioSrc={audioBook?.audio?.audio} subtitleSrc={audioBook?.audio?.srt} />
          {/* )} */}
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

export default Listen;
