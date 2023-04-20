import React from "react";

function Dropdown({ handleSpeed }) {
  const handleChange = (e) => {
    handleSpeed(e.target.value);
  };

  return (
    <>
      <label
        htmlFor="speed"
        className="block mt-4 font-medium md:text-md lg:text-xl"
      >
        Select an option
      </label>
      <select
        id="speed"
        onChange={handleChange}
        className="px-7 py-2 rounded-lg mt-2"
        // className="bg-gray-50 border text-lg border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      >
        <option defaultValue value="slow">
          Slow
        </option>
        <option value="medium">Medium</option>
        <option value="fast">Fast</option>
      </select>
    </>
  );
}

export default Dropdown;
