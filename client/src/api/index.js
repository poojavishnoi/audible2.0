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

export const convertTextToSpeech = async(textValue) => {
  try{
    const response = await fetch(`${baseUrl}api/convertfile`,{
      headers:{
        "Content-Type": "application/json" 
      },
      body:JSON.stringify({textValue}),
      method:"POST"
    })
    return response.data
  }catch{

  }
}