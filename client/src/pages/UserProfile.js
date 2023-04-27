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
                  {books.audio?.map((book) => {
                    return (
                      <div
                        key={book._id}
                        onClick={() => {
                          flipLogic(book._id);
                        }}
                        className="sm:ml-[50%] md:ml-[50%] lg:ml-[25%]  w-[21rem] h-[30rem] relative flex items-center hover:cursor-pointer"
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
                              ? "p-2 absolute z-20 w-80 h-[28rem] bg-white rounded-l-3xl"
                              : "p-2 absolute z-40 w-80 h-[28rem] bg-white rounded-l-3xl -translate-x-full transition-all duration-30000 border-r-2 shadow-xl border-r-gray-500"
                          }`}
                        >
                          <h1 className="text-lg underline  text-center text-black">
                            Title
                          </h1>
                          <p className="text-xs text-justify text-black">
                            Author Book
                          </p>
                          <p className="text-xs text-justify text-black">
                            Duration
                          </p>
                        </div>
                        <div className="select-auto p-2 absolute z-20 w-80 h-[28rem] bg-white rounded-r-3xl">
                          <h1 className="text-lg underline  text-center text-black">
                            Summary
                          </h1>
                          <p className="text-xs text-justify text-black">
                            Lorem ipsum dolor sit amet consectetur adipisicing
                            elit. Nihil ipsam consectetur sunt quod. Molestias,
                            maiores sapiente. Unde quaerat, tenetur labore quo
                            consequatur quibusdam repellendus harum ad vitae
                            inventore amet dolore. Adipisci laboriosam est
                            fugiat vero facilis aspernatur maiores, eveniet
                            harum, aliquid inventore quae laborum
                            necessitatibus, veniam cupiditate vitae quaerat
                            nesciunt deserunt repudiandae. Optio, in! Magni
                            eveniet iusto quam veritatis corrupti. Est
                            laudantium perspiciatis, veritatis iure voluptatum
                            libero ipsa, quo eligendi delectus impedit soluta
                            officiis non ab blanditiis! Dolorum, dicta. Numquam
                            voluptates hic recusandae totam sint ipsa inventore
                            consequuntur laboriosam officia. Veniam nihil
                            reprehenderit, fugit impedit ad quae molestiae
                            libero reiciendis sit alias facilis quam provident
                            consectetur accusamus voluptas inventore!
                            Repudiandae saepe alias excepturi, doloremque ipsum
                            doloribus explicabo consequatur reiciendis
                            architecto. Asperiores dignissimos voluptatum dicta
                            sed deleniti, quae accusamus perferendis temporibus
                            voluptatibus neque ea. Natus, dolores error optio
                            doloribus vero aut nam minus rerum quidem
                            praesentium neque enim, odio dolorem impedit!
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
