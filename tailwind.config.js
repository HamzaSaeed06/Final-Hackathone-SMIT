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
        teal: {
          primary: '#0D9488',
          dark: '#0A7A70',
          label: '#0D9488',
        },
        hero: '#1C2B2B',
        cream: '#EAE6DC',
        'text-primary': '#0F1A17',
        'text-body': '#374151',
        'text-muted': '#6B7280',
        'border-light': '#E5E7EB',
        'card-alt': '#F7F5F0',
      },
      boxShadow: {
        card: '0 1px 3px rgba(0,0,0,0.08), 0 4px 16px rgba(0,0,0,0.04)',
      },
    },
  },
  plugins: [],
}
