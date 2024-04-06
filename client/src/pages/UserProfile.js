import React, { useState, useEffect } from "react";
import "../App.css";
import { useStateValue } from "../context/StateProvider";
import empty from "../images/empty.png";
import { useNavigate } from "react-router";
import axios from "axios";

const baseUrl = "http://localhost:4000/";

function UserProfile() {
  const [{ user }, dispatch] = useStateValue();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const getAudioBooks = async () => {
    if (user != null || user !== undefined) {
      try {
        // console.log(user.user.email, "user")
        if (loading) {
          const response = await fetch(
            `${baseUrl}api/mongi/getPersonalLibrary/${user.user.email}`
          );
          const data = await response.json();
          // for (let i = 0; i < data.audio.length; i++) {
          //   data.audio[i].summa = false
          // }
          console.log(data, "data");
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
      }
    }
    console.log(books, "Books");
    setBooks(newBooks);
  };

  useEffect(() => {
    try {
      if (books == null || books === undefined) {
        setLoading(true);
      }
      getAudioBooks();
    } catch (error) {
      console.log(error);
    }
  }, [user]);

  const AudioPlay = (id) => {
    navigate("/listen", {
      state: {
        id: id,
      },
    });
  };

  const DeleteAudioBook = (id) => {
    axios.delete(`${baseUrl}api/mongi/deleteAudio/${id}`).then((res) => {
      getAudioBooks();
    });
  };

  return (
    <div className="mx-10 my-7  ">
      {user ? (
        <div className="flex flex-col md:flex-col md:w-full lg:flex-row">
          <div className=" lg:w-[23rem] md:py-10 md:mb-4 lg:p-10 flex flex-col text-white items-center max-h-[50rem] rounded-lg orange text-2xl">
            <img
              src={user.user.imageURL}
              className="h-56 w-56 mb-4 rounded-full"
              alt="profile"
            />
            <h1 className="text-xl py-1">{user.user.name}</h1>
            <h1 className="text-xl ">{user.user.email}</h1>
          </div>
          <div className="w-full  px-4">
            {loading ? (
              <img src={empty} alt="empty" className="" />
            ) : (
              <div className=" bg-image p-4 rounded-lg">
                <h1 className="text-4xl  pb-2">
                  saved items: {books.audio?.length}
                </h1>

                <div className="flex flex-wrap gap-4 pt-5">
                  {books.audio?.map((book, index) => {
                    return (
                      <div
                        key={book._id}
                        onClick={() => {
                          flipLogic(book._id);
                        }}
                        className="sm:ml-[50%] md:ml-[50%] lg:ml-[50%]  w-[21rem] h-[30rem] relative flex items-center hover:cursor-pointer"
                      >
                        <div
                          className={`${
                            !book.summa
                              ? "absolute z-30 w-[21rem] h-[30rem] rounded-r-3xl transition-all duration-30000 origin-left"
                              : "absolute z-20 w-[21rem] h-[30rem] rounded-r-3xl transition-all duration-30000 rotate-y-180 origin-left"
                          }`}
                        >

<h1 className="text-2xl absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white font-bold tracking-wider	 ">
                          {book.file_name}
                        </h1>
                          <img
                            src={`${book.image}`}
                            className="w-full h-full rounded-r-3xl"
                            alt="book-cover"
                          />
                        </div>
                        <div
                          className={`${
                            !book.summa
                              ? "p-4 absolute z-20 w-80 h-[28rem] bg-white rounded-l-3xl"
                              : "p-4 absolute z-40 w-80 h-[28rem] bg-white rounded-l-3xl -translate-x-full transition-all duration-30000 border-r-2 shadow-xl border-r-gray-500"
                          }`}
                        >
                          {/* <h1 className="text-lg underline  text-center text-black">
                            Title
                          </h1> */}
                          <p className="text-[1rem] px-5 pt-4 text-justify text-black">{

                          }
                            Author: {book.author_email}
                          </p>
                          <p className="text-[1rem] px-5 pt-2 text-justify text-black">
                            {

                              index === 0 ? "Duration: 222.04 seconds" : `Duration: ${book.duration?.toFixed(2)} seconds`
                            
                          }
                          </p>
                          <p className="text-[1rem] px-5 pt-2 text-justify text-black">
                          {

index === 0 ? "Language: English" : `Language: ${book.language=="en"?"English":"German"}`

}
                          
                        </p>
                        </div>
                        <div className="select-auto p-2 absolute z-20 w-80 h-[28rem] bg-white rounded-r-3xl">
                          <h1 className="text-md underline  text-center text-black">
                            Summary
                          </h1>
                          <p className="text-[0.9rem] text-justify text-black">

                            {book.summary_text}
                           
                          </p>
                        </div>
                        <div className="absolute z-10 w-[21rem] h-[30rem] bg-blue-300 rounded-r-3xl">
                          <img
                            src={`${book.image}`}
                            className="w-full h-full rounded-r-3xl"
                            alt="book-cover"
                          />
                        </div>
                        <button
                          className="absolute z-20 w-10 h-10 yellow rounded-full right-0 top-0 m-2"
                          onClick={() => {
                            AudioPlay(book._id);
                          }}
                        >
                          Play
                        </button>

                        {book.author_email === user.user.email ? (
                          <button
                            className="absolute z-20 w-20 h-10 yellow rounded-full bottom-0 right-0 m-2"
                            onClick={() => {
                              DeleteAudioBook(book._id);
                            }}
                          >
                            Delete
                          </button>
                        ) : (
                          <></>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <h1>loading</h1>
      )}
    </div>
  );
}

export default UserProfile;
