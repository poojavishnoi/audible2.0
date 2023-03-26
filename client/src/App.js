import "./App.css";
import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { Home, Login, ConvertFile } from "./pages";
import { auth } from "./config/firebase.config";
import { useNavigate } from "react-router-dom";
import {useStateValue} from './context/StateProvider'
import { validateUser } from "./api";
import { actionType } from "./context/reducer";
import Footer from "./components/Footer";
import Header from "./components/Header";
import PublicLibrary from "./pages/PublicLibrary";
import SavedLibrary from "./pages/SavedLibrary";
import Listen from "./pages/Listen";

import Blog from "./pages/Blog";
import Text from "./pages/legacy";
import UserProfile from "./pages/UserProfile";
function App() {

  const navigate = useNavigate();
  const [{user}, dispatch] = useStateValue()
  const [authentication, setAuthentication] = useState(
    false || window.localStorage.getItem("auth") === "true"
  );

  useEffect(() => {
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
      } else {
        setAuthentication(false);
        window.localStorage.setItem("auth", "false");
        dispatch({
          type: actionType.SET_USER,
          user: null
        })
        navigate("/login");
      }
    });
  },[]);

  return (
    <div className="App">
    <Header/>
      <Routes>
        <Route
          path="/login"
          element={<Login setAuthentication={setAuthentication} />}
        />
        <Route path="/*" element={<Home />} />
        <Route path="/convertfile" element={<ConvertFile />} />
        <Route path="/savedlibrary" element={<SavedLibrary />} />
        <Route path="/library" element={<PublicLibrary />} />
        <Route path="/listen" element={<Listen />} />
        <Route path="/userprofile" element={<UserProfile />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/legacy" element={<Text/>}/>

      </Routes>
      <Footer/>
    </div>
  );
}

export default App;
