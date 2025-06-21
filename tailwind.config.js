/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        'primary' : '#D40000',
        'secondary': '#005185',
        'tertiary': '#6B7A8B'
      }
    },
  },
  plugins: [],
};
