import React, { useState } from "react";
import logo from "../images/audible20-website-favicon-black.png";
import { useStateValue } from "../context/StateProvider";
import { NavLink, useNavigate } from "react-router-dom";
import { auth } from "../config/firebase.config";
import { motion } from "framer-motion";
function Header() {
  const [{ user }, dispatch] = useStateValue();
  const [isMenu, setIsMenu] = useState(false);
  const navigate = useNavigate();

  const logOut = () => {
    auth
      .signOut()
      .then(() => {
        window.localStorage.setItem("auth", "false");
      })
      .catch((e) => console.log(e));
    navigate("/login", { replace: true });
  };

  return (
    <header className="flex justify-between max-w-7xl p-4 mx-auto ">
      <div className="flex items-center justify-between  w-full space-x-5">
        <a href="/">
          <div className="flex items-center">
            <img
              className="w-14 object-contain cursor-pointer "
              src={logo}
              alt="logo"
            />
            <h3 className=" text-3xl">Audible2.0</h3>
          </div>
        </a>


      <a href="/library">
          <button className="py-2 px-4 mr-4 text-sm yellow rounded-md text-small">
            Listen now
          </button>
        </a>

      </div>

      <div
        onMouseEnter={() => setIsMenu(true)}
        onMouseLeave={() => setIsMenu(false)}
        className="flex gap-2 ml-auto    {user ? ( items-center relative"
      >
        
        {user ? (
          <img
            className="w-12 rounded-full cursor-pointer"
            src={user?.user.imageURL}
            alt="userrProfile"
            referrerPolicy="no-referrer"
          />
        ) : (
          <> </>
        )}

        {isMenu && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="absolute z-10 flex flex-col p-3 gap-2 top-14 right-0 w-96 cursor-pointer bg-gray-50 shadow-lg rounded-lg backdrop-blur-sm"
          >
            <NavLink to={"/userProfile"}>
              <p className=" text-base text-gray-600 hover:font-semibold duration-150 transition-all ease-in-out">
                Profile
              </p>
            </NavLink>
            <NavLink to={"/savedlibrary"}>
              <p className=" text-base text-gray-600 hover:font-semibold duration-150 transition-all ease-in-out">
                My library
              </p>
            </NavLink>
            <hr />
            <p
              onClick={logOut}
              className=" text-base text-gray-600 hover:font-semibold duration-150 transition-all ease-in-out"
            >
              Sign Out
            </p>
          </motion.div>
        )}
      </div>
    </header>
  );
}

export default Header;
