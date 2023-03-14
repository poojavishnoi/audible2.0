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

