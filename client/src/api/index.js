import JSZip from 'jszip';
import axios from "axios";
const baseUrl = "http://localhost:4000/"

export const validateUser = async (token) => {
  try {
    console.log(token);

    const res = await axios.get(`${baseUrl}api/users/login`, {
      headers:{
        Authorization: "Bearer " + token
      }
    })
    return res.data;
  } catch (error) {
    console.log(error);
  }
}

export const getAllAudio = async() => {
  try{
    const res = await axios.get(`${baseUrl}api/audios/getAll`)
    return res.data
  }catch(error){
    console.log(error);
  }
}

export const convertTextToSpeech = async (textValue) => {
  try{
    const response = await axios.post(`${baseUrl}api/convert/coqui`,{text:JSON.stringify(textValue)},{headers:{"Content-Type": "application/json" },responseType: 'arraybuffer'
    })  .then(async resp => {
      const blob = new Blob([resp.data], { type: 'application/zip' });
      const zip = new JSZip();
      await zip.loadAsync(blob);
      const wavFile = zip.file(/\.wav$/i)[0];
      if (!wavFile) {
        throw new Error('No WAV file found in ZIP archive');
      }
      return await wavFile.async('blob');
    })
    .then(wavBlob => {
      const audio = new Audio(URL.createObjectURL(wavBlob));
      audio.play();
    })
    .catch(error => console.error(error));
  }catch{

  }
}