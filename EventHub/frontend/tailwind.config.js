/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#f6f6f6',
        secondary: '#f87171',
        darkerSecondary: '#ec816b',
        white: '#ffffff',
        //gray: '#242424',
        lightGray: '#494949'
      },
    },
  },
  plugins: [],
}

