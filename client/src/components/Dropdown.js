import React from "react";

function Dropdown({ handleSpeed }) {
  const handleChange = (e) => {
    handleSpeed(e.target.value);
  };

  return (
    <div className="text-xl">
      <label
        htmlFor="countries"
        className="block mt-4 font-medium  dark:text-white"
      >
        Select an option
      </label>
      <select
        id="countries"
        onChange={handleChange}
        className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      >
        <option defaultValue value="slow">
          Slow
        </option>
        <option value="medium">Medium</option>
        <option value="fast">Fast</option>
      </select>
    </div>
  );
}

export default Dropdown;
