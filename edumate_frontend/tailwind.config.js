/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        edublue: "#2563eb",
        eduyellow: "#f59e0b"
      }
    }
  },
  plugins: []
};
