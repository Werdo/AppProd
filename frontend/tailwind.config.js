/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          primary: {
            50: '#f0f9ff',
            100: '#e0f2fe',
            500: '#0ea5e9',
            600: '#0284c7',
            700: '#0369a1',
          },
          secondary: {
            50: '#f8fafc',
            100: '#f1f5f9',
            500: '#64748b',
            600: '#475569',
            700: '#334155',
          },
        },
        spacing: {
          '18': '4.5rem',
          '112': '28rem',
          '128': '32rem',
        },
      },
    },
    plugins: [],
  }