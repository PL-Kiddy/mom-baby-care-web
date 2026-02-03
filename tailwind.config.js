/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#ff8fa3",
        "primary-hover": "#f4728e",
        "background-light": "#fff5f7",
        "background-dark": "#2d1b20",
        "text-main": "#4a1d26",
        "text-muted": "#8a6a70",
      },
      fontFamily: {
        display: ["Nunito", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "0.5rem",
        lg: "1rem",
        xl: "1.5rem",
        full: "9999px",
      },
    },
  },
  plugins: [],
}
