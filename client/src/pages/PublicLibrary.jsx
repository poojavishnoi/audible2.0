import React from "react";
import { useEffect, useState } from "react";
import "../style/shelf.css";
import axios from "axios";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";
import { useLocation } from "react-router";
import { useStateValue } from "../context/StateProvider";
const baseUrl = "http://localhost:4000/";

function PublicLibrary() {
  const [books, setBooks] = useState(null);
  const [loading, setLoading] = useState(true);
  const [{ user }, dispatch] = useStateValue();
  const [text, setText] = useState("");
  const [currentAudio, setCurrentAudio] = useState(null);
  const navigate = useNavigate();

  console.log(books, "Books");

  const getBooks = async () => {
    if (user != null || user != undefined) {
      try {
        if (loading) {
          const response = await fetch(`${baseUrl}api/mongi/getPublicLibrary`)
          const data = await response.json()
          for (let i = 0; i < data.audio.length; i++) {
            data.audio[i].summa = false;
          }
          setBooks(data);
          setLoading(false);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const flipLogic = (id) => {
    let newBooks = { ...books };
    
    for (let i = 0; i < newBooks.audio.length; i++) {
      if (newBooks.audio[i]._id == id) {
        newBooks.audio[i].summa = !newBooks.audio[i].summa;
        console.log(newBooks.audio[i].summary_text);
  
        // Pause the currently playing audio (if any)
        if (currentAudio) {
          currentAudio.pause();
        }
  
        // Play the new audio
        let audio = new Audio(`data:audio/wav;base64,${newBooks.audio[i].summary_audio}`);
        if (newBooks.audio[i].summa) {
          audio.play();
        }
  
        // Set the current audio to the new audio
        setCurrentAudio(audio);
      }
    }
  
    console.log(newBooks, "Books");
    setBooks(newBooks);
  };
  

  // const playSummary = (id) => {
  //   let newBooks = { ...books };
  //   let audio = new Audio(duration);
  //   audio.play();
  // }

  const AudioPlay = (id) => {
    navigate("/listen", {
      state: {
        id: id,
      },
    });
  };

  const saveAudioBook = async (id) => {
    console.log("clicked", id);

    try {
      axios.put(`${baseUrl}api/mongi/addListeners/${id}`, {
        listeners: {
          email: user.user.email,
          paused: "00",
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    try {
      if (books == null || books === undefined) {
        setLoading(true);
      }
      getBooks();
    } catch (error) {
      console.log(error);
    }
  }, [user]);

  return (
    <>
      <div className="bg-image pb-20">
        {loading === true ? (
          <h1>Loading...</h1>
        ) : (
          <div className="flex flex-col  justify-center">
            <div className="self-center p-10">
              <input
                type="text"
                onChange={(e) => {
                  setText(e.target.value);
                }}
                placeholder="Enter the name of the file"
                className=" w-[50rem] rounded-lg shadow-2xl shadow-orange-500/50 p-5 bg-white border border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-200 focus:ring-sky-200  focus:ring-1"
              />
            </div>

            <div className=" fade-in-out md:grid-cols-1 grid lg:grid-cols-1 xl:grid-cols-2 items-center justify-center gap-y-32">
              {books.audio
                .filter((value) => {
                  return value.file_name
                    .toLowerCase()
                    .includes(text.toLowerCase(value));
                })
                .map((brok) => {
                  return (
                    <div
                      key={brok._id}
                      onClick={() => {
                        flipLogic(brok._id);
                      }}
                      className="ml-[50%] w-[21rem] h-[30rem] relative flex items-center hover:cursor-pointer"
                    >
                      <div
                        className={`${
                          !brok.summa
                            ? "absolute z-30 w-[21rem] h-[30rem] rounded-r-3xl transition-all duration-30000 origin-left"
                            : "absolute z-20 w-[21rem] h-[30rem] rounded-r-3xl transition-all duration-30000 rotate-y-180 origin-left"
                        }`}
                      >
                      <h1 className="text-2xl absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white font-bold tracking-wider	 ">
                          {brok.file_name}
                        </h1>
                        <img
                          src={`${brok.image}`}
                          className="w-full h-full rounded-r-3xl"
                          alt="book-cover"
                        />
                      </div>
                      <div
                        className={`${
                          !brok.summa
                            ? "p-2 absolute z-20 w-80 h-[28rem] bg-white rounded-l-3xl"
                            : "p-2 absolute z-40 w-80 h-[28rem] bg-white rounded-l-3xl -translate-x-full transition-all duration-30000 border-r-2 shadow-xl border-r-gray-500"
                        }`}
                      >
                        {/* <h1 className="text-lg underline  text-center text-black">
                          {brok.file_name}
                        </h1> */}
                        <p className="text-xs text-justify text-black">
                          Author Book
                        </p>
                        {/* < audio src={duration} className=""/> */}
                        <p className="text-xs text-justify text-black">
                          Duration
                        </p>
                      </div>
                      <div className="select-auto p-2 absolute z-20 w-80 h-[28rem] bg-white rounded-r-3xl">
                        <h1 className="text-lg underline  text-center text-black">
                          Summary
                        </h1>
                        <p className="text-xs text-justify mt-4 text-black">{
                          brok.summary_text
                        }
                          {/* Lorem ipsum dolor sit amet consectetur adipisicing
                          elit. Nihil ipsam consectetur sunt quod. Molestias,
                          maiores sapiente. Unde quaerat, tenetur labore quo
                          consequatur quibusdam repellendus harum ad vitae
                          inventore amet dolore. Adipisci laboriosam est fugiat
                          vero facilis aspernatur maiores, eveniet harum,
                          aliquid inventore quae laborum necessitatibus, veniam
                          cupiditate vitae quaerat nesciunt deserunt
                          repudiandae. Optio, in! Magni eveniet iusto quam
                          veritatis corrupti. Est laudantium perspiciatis,
                          veritatis iure voluptatum libero ipsa, quo eligendi
                          delectus impedit soluta officiis non ab blanditiis!
                          Dolorum, dicta. Numquam voluptates hic recusandae
                          totam sint ipsa inventore consequuntur laboriosam
                          officia. Veniam nihil reprehenderit, fugit impedit ad
                          quae molestiae libero reiciendis sit alias facilis
                          quam provident consectetur accusamus voluptas
                          inventore! Repudiandae saepe alias excepturi,
                          doloremque ipsum doloribus explicabo consequatur
                          reiciendis architecto. Asperiores dignissimos
                          voluptatum dicta sed deleniti, quae accusamus
                          perferendis temporibus voluptatibus neque ea. Natus,
                          dolores error optio doloribus vero aut nam minus rerum
                          quidem praesentium neque enim, odio dolorem impedit! */}
                        </p>
                      </div>
                      <div className="absolute z-10 w-[21rem] h-[30rem] bg-blue-300 rounded-r-3xl">
                        <img
                          src={`${brok.image}`}
                          className="w-full h-full rounded-r-3xl"
                          alt="book-cover"
                        />
                      </div>
                      <button
                        className="absolute z-20 w-14 h-10 yellow  rounded-full right-0 top-0 m-2"
                        onClick={() => {
                          AudioPlay(brok._id);
                        }}
                      >
                        Play
                      </button>

                      {brok.listeners.some(
                        (email) =>
                          email["email"] ||
                          email["author_email"] === `${user.user.email}`
                      ) ? (
                        <></>
                      ) : (
                        <button
                          onClick={() => {
                            saveAudioBook(brok._id);
                          }}
                          className="absolute z-20 w-14 h-10 yellow  rounded-full right-[40%] bottom-4 m-2"
                        >
                          Save
                        </button>
                      )}
                    </div>
                  );
                })}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default PublicLibrary;
