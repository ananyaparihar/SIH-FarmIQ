/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#EDE6D3",
        ink: "#211D14",
        charcoal: "#2B2820",
        fresh: "#4C7A3D",
        mild: "#C4821E",
        rotten: "#8C3A2B",
        line: "#C9BF9F"
      },
      fontFamily: {
        display: ["Fraunces", "serif"],
        sans: ["Inter", "system-ui", "sans-serif"]
      },
      borderRadius: {
        slip: "2px"
      }
    }
  },
  plugins: []
};
