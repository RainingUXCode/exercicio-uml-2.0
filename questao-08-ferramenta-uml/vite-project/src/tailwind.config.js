/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // <-- Garanta que essa linha inclua tsx
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
