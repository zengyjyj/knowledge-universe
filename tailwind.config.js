/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        fadeIn: {
          "0%": { opacity: 0, transform: "translateY(20px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        pulseSoft: {
          "0%": {
            transform: "scale(1)",
            filter: "brightness(1)",
          },
          "50%": {
            transform: "scale(1.05)",
            filter: "brightness(1.2)",
          },
          "100%": {
            transform: "scale(1)",
            filter: "brightness(1)",
          },
        },

        shootingStar: {
          "0%": { transform: "translateX(0) translateY(0)", opacity: 1 },
          "100%": {
            transform: "translateX(-400px) translateY(200px)",
            opacity: 0,
          },
        },
        spinSlow: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
      },
      animation: {
        "fade-in": "fadeIn 1.2s ease-out forwards",
        "pulse-soft": "pulseSoft 1s ease-in-out infinite alternate",
        "shooting-star": "shootingStar 3s linear infinite",
        "spin-slow": "spinSlow 20s linear infinite",
      },
    },
  },
  plugins: [],
};
