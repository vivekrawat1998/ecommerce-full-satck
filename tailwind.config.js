/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      colors:{
        accent:"#179957",
        accentDark:"#184D47",
      },
      container:{
        center:true,
        padding:"15px"
      }
    },
  },
  plugins: [],
}