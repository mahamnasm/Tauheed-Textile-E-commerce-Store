/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'ink-black': '#0B0A09',
        'warm-ivory': '#F8F5EF',
        'soft-sand': '#E8E0D4',
        'antique-gold': '#C5A059',
        'deep-olive': '#344238',
        'rose-clay': '#B66D69',
        'instock-green': '#27764D',
        'alert-maroon': '#8B3C43',
        brand: {
          50: '#FBF9F5',
          100: '#F5EFEB',
          200: '#E8DEC8',
          300: '#D8C6A5',
          400: '#C5A059',
          500: '#B28A3E',
          600: '#8E6D2E',
          700: '#6B5222',
          800: '#1E1B18',
          850: '#181614',
          900: '#12110F',
          950: '#0B0A09',
        },
        dark: {
          surface: '#151412',
          card: '#1A1815',
          elevated: '#211E1A',
          border: '#2A2621',
          muted: '#8E8A82',
        },
        gold: {
          50: '#FBF7EE',
          100: '#F5ECDA',
          200: '#E8D5B0',
          300: '#DABF86',
          400: '#CCA95C',
          500: '#B28A3E',
          600: '#947230',
          700: '#755A25',
          800: '#56421B',
          900: '#382B11',
        },
        sand: {
          50: '#FAF8F5',
          100: '#F2ECE2',
          200: '#E4D7C4',
          300: '#D3BFA5',
          400: '#C2A786',
          500: '#A68A65',
          600: '#846D4F',
          700: '#62513B',
          800: '#423728',
          900: '#231D15',
          950: '#15120D',
        }
      },
      fontFamily: {
        serif: ['Playfair Display', 'Cormorant Garamond', 'Cinzel', 'Georgia', 'serif'],
        sans: ['Plus Jakarta Sans', 'Manrope', 'Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
};
