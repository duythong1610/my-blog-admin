/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#a855f7",
      },
      backgroundImage: {
        customerRanksGradient:
          "linear-gradient(74.12deg, #B070EF 0%, #BF8BF3 49.5%, #FDB99B 100%)",
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false, // <== disable this!
  },
};
