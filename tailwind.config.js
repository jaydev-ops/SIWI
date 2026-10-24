/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'media',
  theme: {
    extend: {
      colors: {
        brand: {
          ink: '#111318',
          charcoal: '#191C21',
          surface: '#24262A',
          gold: '#C69A45',
          goldLight: '#D9B66C',
          ivory: '#F5F2EB',
          ivoryLight: '#FAF8F5',
          grey: {
            100: '#F2F2F0',
            300: '#D8D7D2',
            500: '#858585',
            700: '#45474B',
            900: '#24262A',
          }
        }
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"SF Pro Display"',
          '"SF Pro Text"',
          '"Helvetica Neue"',
          'Arial',
          'sans-serif'
        ],
        serif: [
          '"Cormorant Garamond"',
          '"Libre Baskerville"',
          'Georgia',
          'serif'
        ]
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '30': '7.5rem',
        '36': '9rem',
      },
      letterSpacing: {
        'widest-plus': '0.2em',
        'editorial': '0.12em',
      }
    },
  },
  plugins: [],
};
