import React from 'react'
import logo from '../images/audible20-website-favicon-black.png'


function Footer() {
  return (
    <footer className="p-4 rounded-lg shadow md:px-6 md:py-8 ">
    <div className=" sm:flex sm:items-center sm:justify-between">
      <a href="/">
        <div className="flex items-center">
          <img
            className="w-14 object-contain cursor-pointer "
            src={logo}
            alt="logo"
          />
          <h3 className="">Audible2.0</h3>
        </div>
      </a>
      <ul className="flex flex-wrap items-center mb-6 text-sm text-gray-500 sm:mb-0 dark:text-gray-400">
        <li>
          <a href="#" className="mr-4 hover:underline md:mr-6 ">
            About
          </a>
        </li>
      
        <li>
          <a href="#" className="hover:underline">
            Contact
          </a>
        </li>
      </ul>
    </div>
    <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
    <span className="block text-sm text-gray-500 sm:text-center dark:text-gray-400">
      © 
      <a href="https://flowbite.com/" className="hover:underline">
        Audible2.0
      </a>
      . All Rights Reserved.
    </span>
  </footer>
  )
}

export default Footer