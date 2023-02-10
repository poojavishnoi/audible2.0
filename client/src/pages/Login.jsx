import React, { useEffect } from "react";
import { FcGoogle } from "react-icons/fc";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../config/firebase.config";
import { useNavigate } from "react-router-dom";
import {useStateValue} from '../context/StateProvider'
import { validateUser } from "../api";
import { actionType } from "../context/reducer";
function Login({ setAuthentication }) {

  const googleProvider = new GoogleAuthProvider();
  const navigate = useNavigate();
  const [{user}, dispatch] = useStateValue()

  const GoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider).then((userCred) => {
        if (userCred) {
          setAuthentication(true);
          window.localStorage.setItem("auth", true);
          auth.onAuthStateChanged((userCred) => {
            if (userCred) {
              userCred.getIdToken().then((token) => {
                validateUser(token).then((data) => {
                  dispatch({
                    type: actionType.SET_USER,
                    user: data
                  })
                })
              });
            navigate("/", { replace: true });
            } else {
              setAuthentication(false);
              navigate("/login");
            }
          });
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if(window.localStorage.getItem("auth") === "true"){
      navigate("/", { replace: true });
    }
  },[])

  return (
    <div className=" p-72 p-auto border-t-2 border-black-200">
      <div className=" bg-orange shadow-xl max-w-5xl mx-auto p-10 align-middle text-gray-700 rounded-lg">
        <h2 className="text-2xl font-medium">Join Today</h2>
        <div className="py-4">
          <h3 className="py-4 ">Sign in with one of the providers</h3>
          <button
            onClick={GoogleLogin}
            className="w-full bg-gray-700 font-medium text-white rounded-lg p-4 gap-2 flex align-middle"
          >
            <FcGoogle className="text-2xl" />
            Sign in with Google
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
