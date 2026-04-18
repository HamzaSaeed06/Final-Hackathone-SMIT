/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./styles/**/*.{css}",
  ],
  theme: {
    extend: {
      colors: {
        teal: { primary: '#0D9488', dark: '#0A7A70' },
        hero: '#1C2B2B',
        cream: '#EAE6DC'
      }
    },
  },
  plugins: [],
}
