import React from "react";
import homeImg from "../images/homee.jpg";
import blogImg from "../images/blog.jpg";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../config/firebase.config";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import { AnimatePresence, motion } from "framer-motion";
import * as pdfjsLib from "pdfjs-dist";

pdfjsLib.GlobalWorkerOptions.workerSrc =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js";

function Home() {
  const [cint, setcint] = useState(0);
  const [file, setFile] = useState({});
  const [textValue, setTextValue] = useState("");
  const navigate = useNavigate();
  const [imgUrl, setImgUrl] = useState("");
  const [FileType, setFileType] = useState("");
  const [preview, setPreview] = useState(false);
  const [showDropDown, setShowDropDown] = useState(false);
  const imgUrls = [
    "First",
    "Second",
    "Third",
    "Fourth",
    "Fifth",
    "Sixth",
    "Seventh",
    "Eighth",
    "Ninth",
  ];
  const [current, setCurrent] = useState(0);
  const prev = () => {
    setCurrent(current === 0 ? imgUrls.length - 1 : current - 1);
    setImgUrl(imgUrl);
  };
  const next = () => {
    setCurrent(current === imgUrls.length - 1 ? 0 : current + 1);
    setImgUrl(imgUrl);
  };

  console.log(imgUrl);

  const convertFile = async () => {
    if (
      file?.name?.includes(".txt") ||
      file?.name?.includes(".pdf") ||
      file?.name?.includes(".docx")
    ) {
      navigate("/convertfile", {
        state: {
          name: materialname,
          extention: FileType,
          textValue: textValue,
          file: material,
          image: imgUrl,
        },
      });
    } else {
      Swal.fire({
        icon: "warning",
        title: "Please Enter File Formats Of Pdf, Docs, Txt",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };
  //file.name.split(".")[1],
  const getPDFThumbnail = async (url) => {
    // Load the PDF document
    const fileReader = new FileReader();

    fileReader.onload = async () => {
      const pdfData = new Uint8Array(fileReader.result);
      const pdf = await pdfjsLib.getDocument(pdfData).promise;

      //content
      const pages = [];
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const text = content.items.map((item) => item.str).join("");
        pages.push(text);
      }

      setTextValue(pages.join());

      // Fetch the first page of the PDF
      const page = await pdf.getPage(1);

      // Set the canvas dimensions and scale
      const canvas = document.createElement("canvas");
      const viewport = page.getViewport({ scale: 1.5 });
      canvas.width = viewport.width;
      canvas.height = viewport.height;

      // Render the PDF page to the canvas
      const renderContext = {
        canvasContext: canvas.getContext("2d"),
        viewport: viewport,
      };
      await page.render(renderContext).promise;

      // Convert the canvas to a base64-encoded thumbnail image

      const dataUrl = canvas.toDataURL("image/jpeg");
      setImgUrl(dataUrl);
      return dataUrl;
    };
    fileReader.readAsArrayBuffer(url);
  };

  //load doc content
  const getDocContent = (file) => {
    const reader = new FileReader();

    reader.onload = async (e) => {
      const content = e.target.result;
      // const buffer = new Uint8Array(reader.result);
      // console.log(buffer);

      var zip = new PizZip(content);
      console.log(zip);
      var doc = new Docxtemplater().loadZip(zip, {
        paragraphLoop: true,
        linebreaks: true,
      });

      console.log(doc.getThumbnail());
    };
    reader.readAsArrayBuffer(file);
  };

  const [materialname, setmaterialname] = useState();
  const [material, setmaterial] = useState();
  const fileChange = (file) => {
    const fil = file.target.files[0];
    let s = fil.name;
    let stop = s.indexOf(".");
    setmaterialname(s.slice(0, stop));
    const reader = new FileReader();
    reader.readAsDataURL(file.target.files[0]);
    if (file.target.files[0].type == "text/plain") {
      setFileType("txt");
      setmaterial("");
    } else if (
      file.target.files[0].type ==
      "application/vnd.openxmlformats-officedocument.presentationml.presentation"
    ) {
      setFileType("pptx");
      reader.onloadend = () => {
        setmaterial(reader.result.slice(reader.result.indexOf(",") + 1));
      };
    } else if (file.target.files[0].type == "application/pdf") {
      setFileType("pdf");
      reader.onloadend = () => {
        setmaterial(reader.result.slice(reader.result.indexOf(",") + 1));
      };
    } else if (
      file.target.files[0].type ==
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      setFileType("docx");
      reader.onloadend = () => {
        setmaterial(reader.result.slice(reader.result.indexOf(",") + 1));
      };
    } else if (file.target.files[0].type == "image/jpeg") {
      setFileType("jpeg");
      reader.onloadend = () => {
        setmaterial(reader.result.slice(reader.result.indexOf(",") + 1));
      };
    } else if (file.target.files[0].type == "image/png") {
      setFileType("png");
      reader.onloadend = () => {
        setmaterial(reader.result.slice(reader.result.indexOf(",") + 1));
      };
    } else {
      Swal.fire({
        icon: "warning",
        title: "Please Enter File Formats Of Txt, Pdf, Ppt, Docs, Jpeg",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };

  const handleChange = async (e) => {
    setFile(e.target.files[0]);
    fileChange(e);
    const file = e.target.files[0];
    if (file.type === "application/pdf") {
      await getPDFThumbnail(file);
    } else if (
      file.type ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      getDocContent(file);
    } else {
      let reader = new FileReader();
      reader.onload = (e) => {
        const file = e.target.result;
        setTextValue(file);
      };
      reader.onerror = (e) => alert(e.target.error.name);
      reader.readAsText(file);
    }
    setPreview(true);
  };

  return (
    <div>
      <div className=" w-100% bg-image py-10 my-4 flex justify-around items-center relative overflow-hidden">
        <AnimatePresence>
          {cint == 0 ? (
            <div className="abolute flex items-center justify-between w-full">
              <motion.div
                className=" w-full py-60 p-4 ml-4 xl:ml-16 md:w-3/4 flex flex-col items-center justify-center"
                key={cint}
                initial={{ x: -400 }}
                animate={{ x: 0 }}
                exit={{ x: 400 }}
                transition={{ duration: 0.75, type: "spring" }}
              >
                <h1 className="text-4xl md:text-5xl xl:text-6xl ">
                  Audio book for your kids
                </h1>
                <h1 className=" text-lg md:text-xl xl:text-2xl pt-3">
                  Make learning alot of fun by listening the book.
                </h1>
                <h1 className="text-xl mb-4">
                  Convert the pdf, text or word files into audio.
                </h1>
              </motion.div>
              <div className="w-full py-60 p-4 ml-4 xl:ml-16 md:w-1/4 flex flex-col items-end justify-center relative">
                <div className=" w-32 h-32 rounded-full absolute  blur-xl flex flex-col items-center justify-center"></div>
                <button
                  className="relative before:z-10 before:absolute before:-left-3 before:top-1/2 before:w-max before:max-w-xs before:-translate-x-full before:-translate-y-1/2 before:rounded-md before:bg-gray-700 before:px-3 before:py-2 before:text-white before:invisible before:content-[attr(data-tip)] after:z-10 after:absolute after:-left-[0.8rem] after:top-1/2 after:h-0 after:w-0 after:translate-x-0 after:-translate-y-1/2 after:border-8 after:border-l-gray-700 after:border-r-transparent after:border-b-transparent after:border-t-transparent after:invisible hover:before:visible hover:after:visible"
                  data-tip="Explore"
                  onClick={() => {
                    setcint(1);
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-32 h-32 hover:scale-105 cursor-pointer transition-all relative"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M11.25 4.5l7.5 7.5-7.5 7.5m-6-15l7.5 7.5-7.5 7.5"
                    />
                  </svg>
                </button>
              </div>
            </div>
          ) : (
            <div className="abolute flex items-center justify-between w-full">
              <motion.div
                className="w-full p-4 md:w-3/4 flex items-center justify-center flex-1 mr-48"
                key={cint}
                initial={{ x: 700 }}
                animate={{ x: 0 }}
                exit={{ x: -700 }}
                transition={{ duration: 1, type: "spring" }}
              >
                {!preview ? (
                  <div className=" w-full flex flex-col items-center justify-center flex-1">
                    <label className="text-md" htmlFor="file_input">
                      Upload file
                    </label>
                    <input
                      className="block w-full md:w-1/2 text-sm text-white border rounded-md cursor-pointer bg-gray-800 dark:text-gray-400 focus:outline-none"
                      id="file_input"
                      type="file"
                      onChange={handleChange}
                    />
                    <p className="mt-1 text-sm" id="file_input_help">
                      txt or pdf.
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col">
                    <div className="relative text-left inline-block w-fit ">
                      <div className="flex flex-col p-5 min-h-[40rem] rounded-md bg-white items-center justify-center relative z-20">
                        <div className="">
                          <p>
                            You can choose bookcovers as per your choice by
                            clicking on the arrow
                          </p>
                        </div>
                        <button
                          onClick={() => {
                            setShowDropDown(!showDropDown);
                          }}
                          className="items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-xs sm:text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100"
                        >
                          <div className="flex items-center ">
                            <img
                              className="m-5 bg-red-200 !rounded-3xl !w-72  !object-contain  !h-[100%] !flex-1"
                              src={imgUrl}
                              alt="img"
                            />
                            {showDropDown ? (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="mr-1 ml-2 h-5 w-5"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M11.25 9l-3 3m0 0l3 3m-3-3h7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>
                            ) : (
                              <svg
                                className="mr-1 ml-2 h-5 w-5"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M12.75 15l3-3m0 0l-3-3m3 3h-7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>
                            )}
                          </div>
                        </button>
                      </div>
                      {showDropDown ? (
                        <motion.div
                          className="animate-slide-out transition-all duration-10000 flex items-center absolute bg-white top-0 left-[101%] z-10 w-[82%] h-full origin-top-right rounded-md p-7 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                          initial={{ transform: "translateX(-90%)" }}
                          animate={{ transform: "translateX(0%)" }}
                          exit={{ transform: "translateX(-90%)" }}
                          transition={{
                            ease: "linear",
                            duration: 0.01,
                          }}
                        >
                          <button
                            onClick={prev}
                            className="mx-1 p-2 rounded-full bg-gray-400"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="h-5 w-5"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M21 16.811c0 .864-.933 1.405-1.683.977l-7.108-4.062a1.125 1.125 0 010-1.953l7.108-4.062A1.125 1.125 0 0121 8.688v8.123zM11.25 16.811c0 .864-.933 1.405-1.683.977l-7.108-4.062a1.125 1.125 0 010-1.953L9.567 7.71a1.125 1.125 0 011.683.977v8.123z"
                              />
                            </svg>
                          </button>
                          <div className="flex relative overflow-hidden">
                            <div
                              className="relative flex items-center transition-transform ease-out duration-500"
                              style={{
                                transform: `translateX(-${current * 100}%)`,
                              }}
                            >

                              {imgUrls.map((value, x) => (
                                <img
                                  className="!rounded-3xl !w-[100%] m !object-contain !h-[100%]  !flex-1"
                                  src={`/book_cover/${value}.jpg`}
                                  alt="img"
                                  onClick={() => {
                                    setImgUrl(`/book_cover/${value}.jpg`);
                                    setShowDropDown(!showDropDown);
                                  }}
                                />
                              ))}
                            </div>
                            <div className="absolute bottom-4  right-0 left-0">
                              <div className="flex items-center justify-center gap-2">
                                {imgUrls.map((value, x) => (
                                  <div
                                    className={`transition-all w-3 h-3 bg-white rounded-full ${
                                      current === x ? "p-2" : "bg-opacity-50"
                                    }`}
                                  ></div>
                                ))}
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={next}
                            className="mx-1 p-2 rounded-full bg-gray-400"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="h-5 w-5"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M3 8.688c0-.864.933-1.405 1.683-.977l7.108 4.062a1.125 1.125 0 010 1.953l-7.108 4.062A1.125 1.125 0 013 16.81V8.688zM12.75 8.688c0-.864.933-1.405 1.683-.977l7.108 4.062a1.125 1.125 0 010 1.953l-7.108 4.062a1.125 1.125 0 01-1.683-.977V8.688z"
                              />
                            </svg>
                          </button>
                        </motion.div>
                      ) : (
                        ""
                      )}
                    </div>
                    <div className="flex items-center justify-around">
                      <button
                        onClick={() => {
                          setPreview(!preview);
                        }}
                        className="orange text-white px-6 py-3 mt-3 cursor-pointer rounded-lg"
                      >
                        Back
                      </button>
                      <button
                        onClick={convertFile}
                        className="orange text-white px-6 py-3 mt-3 cursor-pointer rounded-lg"
                      >
                        Upload
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
              <div className="w-full py-60 p-4 ml-4 xl:ml-16 md:w-1/4 flex flex-col items-end justify-center relative">
                <div className=" w-32 h-32 rounded-full absolute bg-yellow-200 blur-xl flex flex-col items-center justify-center"></div>
                <button
                  className="relative before:z-10 before:absolute before:-left-3 before:top-1/2 before:w-max before:max-w-xs before:-translate-x-full before:-translate-y-1/2 before:rounded-md before:bg-gray-700 before:px-3 before:py-2 before:text-white before:invisible before:content-[attr(data-tip)] after:z-10 after:absolute after:-left-[0.8rem] after:top-1/2 after:h-0 after:w-0 after:translate-x-0 after:-translate-y-1/2 after:border-8 after:border-l-gray-700 after:border-r-transparent after:border-b-transparent after:border-t-transparent after:invisible hover:before:visible hover:after:visible"
                  data-tip="Explore"
                  onClick={() => {
                    setcint(0);
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-32 h-32 hover:scale-105 cursor-pointer transition-all relative"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M18.75 19.5l-7.5-7.5 7.5-7.5m-6 15L5.25 12l7.5-7.5"
                    />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </AnimatePresence>
      </div>

      <div className=" bg-emerald-50	 rounded-lg p-7 mx-4 my-10 md:mx-10 xl:mx-40 ">
        <h1 className="text-xl">Blogs you might want to read</h1>

        <div className=" flex flex-wrap justify-center mt-4">
          <div className=" rounded-md overflow-hidden relative w-80  m-5 bg-white">
            <img src={homeImg} alt="home" />
            <h1 className="text-lg p-4 ">Learning Disabilities</h1>
            <h1 className="text-sm px-4 pb-32">
              If you feel that your organizational skills need improvement, then
              you must rely on tools strategies to help you be more productive.
            </h1>
            <button
              onClick={() =>
                navigate("/blog", {
                  state: {
                    id: 1,
                  },
                })
              }
              className="m-4 p-1 absolute bottom-0 rounded-md bg-orange-200 cursor-pointer  border"
            >
              Read more
            </button>
          </div>

          <div className=" rounded-md overflow-hidden relative w-80  m-5 bg-white">
            <img src={blogImg} alt="blog img" />

            <h1 className="text-lg p-4 ">
              Dealing With an ADHD Diagnosis as an Adult
            </h1>
            <h1 className="text-sm px-4 ">
              Many people associate ADHD witdetailsh children, or think it’s a
              “kid’s disorder”. But, about 4-5% of adults in the U.S. have it.
              Unfortunately, not many adults get an official diagnosis or
              treatment.
            </h1>
            <button
              onClick={() =>
                navigate("/blog", {
                  state: {
                    id: 2,
                  },
                })
              }
              className="m-4 p-1 absolute bottom-0  rounded-md bg-orange-200 cursor-pointer  border"
            >
              Read more
            </button>
          </div>

          <div className=" rounded-md overflow-hidden relative w-80 m-5 bg-white">
            <img src={homeImg} alt="home" />
            <h1 className="text-lg p-4 ">
              Learning Disability, Dyslexia, ADHD Know Your Rights
            </h1>
            <h1 className="text-sm px-4 ">
              if you suffer from learning disabilities, attention deficit
              hyperactivity disorder (ADHD) or dyslexia, you are entitled to
              certain inalienable rights under the Individuals with Disabilities
              Education Act 2004 (IDEA)
            </h1>
            <button
              onClick={() =>
                navigate("/blog", {
                  state: {
                    id: 3,
                  },
                })
              }
              className="m-4 p-1 absolute bottom-0 rounded-md bg-orange-200 cursor-pointer  border"
            >
              Read more
            </button>
          </div>

          <div className=" rounded-md overflow-hidden relative w-80 m-5 bg-white">
            <img src={blogImg} alt="blog img" />
            <h1 className="text-lg p-4 ">
              Learning Disability Testing and Assessment
            </h1>
            <h1 className="text-sm px-4 ">
              No parent likes to watch their child struggle. Not in school, not
              in life. No adult wants to struggle with learning disabilities
              either.{" "}
            </h1>
            <button
              onClick={() =>
                navigate("/blog", {
                  state: {
                    id: 4,
                  },
                })
              }
              className="m-4 p-1 absolute bottom-0  rounded-md bg-orange-200 cursor-pointer  border"
            >
              Read more
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
