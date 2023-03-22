import React from "react";
import homeImg from "../images/homee.jpg";
import blogImg from "../images/blog.jpg";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../config/firebase.config";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";

import * as pdfjsLib from 'pdfjs-dist' 
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js'

function Home() {
  const [file, setFile] = useState({});
  const [textValue, setTextValue] = useState("");
  const navigate = useNavigate();
  const [imgUrl, setImgUrl] = useState("")


  const convertFile = async () => {
    if (file?.name?.includes(".txt") || file?.name?.includes(".pdf") || file?.name?.includes(".docx")) {
      navigate("/convertfile", {
        state: {
          extention: file.name.split(".")[1],
          textValue: textValue,
          file: file,
          image: imgUrl
        },
      });
    } else {
      window.alert("Sahi file daal");
    }
  };

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
        const text = content.items.map(item => item.str).join('');
        pages.push(text);
      }
 
      setTextValue(pages.join());


      // Fetch the first page of the PDF
      const page = await pdf.getPage(1);

      // Set the canvas dimensions and scale
      const canvas = document.createElement('canvas');
      const viewport = page.getViewport({ scale: 1.5 });
      canvas.width = viewport.width;
      canvas.height = viewport.height;
    
      // Render the PDF page to the canvas
      const renderContext = {
        canvasContext: canvas.getContext('2d'),
        viewport: viewport
      };
      await page.render(renderContext).promise;
    
      // Convert the canvas to a base64-encoded thumbnail image

      const dataUrl = canvas.toDataURL('image/jpeg');
      setImgUrl(dataUrl);
      return dataUrl;
    }
    fileReader.readAsArrayBuffer(url);

  };

  const handleChange = async (e) => {
    setFile(e.target.files[0]);

    const file = e.target.files[0];
    if (file.type === "application/pdf") {
      await getPDFThumbnail(file)
    }else{

    let reader = new FileReader();
    reader.onload = (e) => {
      const file = e.target.result;
      setTextValue(file);
    };
    reader.onerror = (e) => alert(e.target.error.name);
    reader.readAsText(file);
  }
  };



  return (
    <div>
      <div className=" w-100% bg-image py-10 px-44 my-4">
        <div className="flex ">
         
          <div className=" w-full py-60 p-4 ml-4 xl:ml-16 md:w-1/2 ">
            <h1 className="text-4xl md:text-5xl xl:text-6xl ">
            Audio book for your kids</h1>
            <h1 className=" text-lg md:text-xl xl:text-2xl pt-3">
              Make learning alot of fun by listening the book.
            </h1>
            <h1 className="text-xl mb-4">
              Convert the pdf, text or word files into audio.
            </h1>

            <label className="text-md" htmlFor="file_input">
              Upload file
            </label>
            <input
              className="block w-full md:w-1/2  text-sm text-white p-1  border rounded-md cursor-pointer bg-gray-800	 dark:text-gray-400 focus:outline-none"
              id="file_input"
              type="file"
              onChange={handleChange}
            />
            <p className="mt-1 text-sm" id="file_input_help">
              txt or pdf.
            </p>
            <button
              onClick={convertFile}
              className="orange text-white px-6 py-3 mt-3 cursor-pointer rounded-lg"
            >
              Convert
            </button>
            
          </div>
          {/* <img
            className="w-96  object-cover bg-white"
            src={homeImg}
            alt="home"
          /> */}
        </div>
      </div>

      <div className=" bg-emerald-50	 rounded-lg p-7 mx-4 my-10 md:mx-10 xl:mx-40 ">
        <h1 className="text-xl">Blog you might want to read</h1>

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
