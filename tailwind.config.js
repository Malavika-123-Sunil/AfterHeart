/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Primary colors
        primary: {
          50: '#EBF5FB',
          100: '#D6EAF8',
          200: '#AED6F1',
          300: '#85C1E9',
          400: '#5DADE2',
          500: '#3498DB',
          600: '#2980B9',
          700: '#1F618D',
          800: '#154360',
          900: '#0A2233',
        },
        // Secondary colors (pink/rose tones)
        secondary: {
          50: '#FDEDEC',
          100: '#FADBD8',
          200: '#F5B7B1',
          300: '#F1948A',
          400: '#EC7063',
          500: '#E74C3C',
          600: '#CB4335',
          700: '#B03A2E',
          800: '#943126',
          900: '#78281F',
        },
        // Accent colors (earth tones)
        accent: {
          50: '#F4F6F6',
          100: '#EAEDED',
          200: '#D5DBDB',
          300: '#BFC9CA',
          400: '#AAB7B8',
          500: '#95A5A6',
          600: '#839192',
          700: '#717D7E',
          800: '#5F6A6A',
          900: '#4D5656',
        },
        // Success colors
        success: {
          50: '#E8F6F3',
          100: '#D1EDE7',
          200: '#A3DBCF',
          300: '#76C8B7',
          400: '#48B69F',
          500: '#1ABC9C',
          600: '#17A589',
          700: '#148F77',
          800: '#117964',
          900: '#0E6251',
        },
        // Warning colors
        warning: {
          50: '#FEF9E7',
          100: '#FCF3CF',
          200: '#F9E79F',
          300: '#F7DC6F',
          400: '#F4D03F',
          500: '#F1C40F',
          600: '#D4AC0D',
          700: '#B7950B',
          800: '#9A7D0A',
          900: '#7D6608',
        },
        // Error colors
        error: {
          50: '#FDEDEC',
          100: '#FADBD8',
          200: '#F5B7B1',
          300: '#F1948A',
          400: '#EC7063',
          500: '#E74C3C',
          600: '#CB4335',
          700: '#B03A2E',
          800: '#943126',
          900: '#78281F',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Montserrat', 'sans-serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
};