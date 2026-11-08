/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['Fraunces', 'Georgia', 'serif'],
        bubbly: ['Fredoka', 'sans-serif'],
        sans: ['"Plus Jakarta Sans"', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      colors: {
        cream: {
          DEFAULT: '#F6EFE5',
          50: '#FDFBF7',
          100: '#F6EFE5',
          200: '#EBDDCC',
          300: '#DFCCB5',
        },
        espresso: {
          DEFAULT: '#331B0F',
          light: '#5A3825',
          dark: '#1F0F07',
        },
        terracotta: {
          DEFAULT: '#B23B14',
          hover: '#962E0B',
          light: '#F8DED2',
          pill: '#C5441B',
        },
      },
    },
  },
  plugins: [],
}
