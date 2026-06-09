/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // All colors reference CSS variables so light/dark theme works
        // automatically on every component without any class changes.
        ink: "rgb(var(--color-ink) / <alpha-value>)",
        parchment: "rgb(var(--color-parchment) / <alpha-value>)",
        gold: "rgb(var(--color-gold) / <alpha-value>)",
        "gold-light": "rgb(var(--color-gold-light) / <alpha-value>)",
        slate: "rgb(var(--color-slate) / <alpha-value>)",
        ember: "rgb(var(--color-ember) / <alpha-value>)",
      },
      fontFamily: {
        serif: ["Playfair Display", "Georgia", "serif"],
        lora: ["Lora", "Georgia", "serif"],
        sans: ["DM Sans", "system-ui", "sans-serif"],
        hebrew: ["Frank Ruhl Libre", "Georgia", "serif"],
      },
    },
  },
  plugins: [],
};