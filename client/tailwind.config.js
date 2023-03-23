/** @type {import('tailwindcss').Config} */
module.exports = {
  rules: [
    {
      test: /\.css$/i,
      use: ["style-loader", "css-loader", "postcss-loader"],
    },
  ],
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
  "editor.quickSuggestions": {
    strings: true,
  },
  "tailwindCSS.emmetCompletions": true,
};
