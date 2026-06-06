/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        parchment: "#F5F0E8",
        ink: "#1A1410",
        gold: "#C9A84C",
        "gold-light": "#E8C96A",
        ember: "#8B3A2A",
        slate: "#3D4B5C",
      },
     fontFamily: {
  serif: ["Playfair Display", "Georgia", "serif"],
  lora: ["Lora", "Georgia", "serif"],
  sans: ["DM Sans", "Inter", "system-ui", "sans-serif"],
  hebrew: ["Frank Ruhl Libre", "serif"],
},
  plugins: [],
    }}};