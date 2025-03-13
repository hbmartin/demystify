/** @type {import('tailwindcss').Config} */
export default {
  theme: {
    extend: {},
  },
  content: [
    "./src/**/*.{vue,js,ts,jsx,tsx}",
    "../../packages/ui/src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  presets: [require("../../packages/ui/tailwind.config.js")],
  plugins: [],
};
