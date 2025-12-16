/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Cores do Mobills
        mobills: {
          primary: '#00D09C',
          'primary-dark': '#00B386',
          'primary-light': '#E6FBF5',
          secondary: '#2D3436',
          dark: '#1A1D1E',
          income: '#00D09C',
          expense: '#FF6B6B',
          background: '#F5F6FA',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'mobills': '0 2px 8px rgba(0, 0, 0, 0.08)',
        'mobills-lg': '0 4px 16px rgba(0, 0, 0, 0.12)',
      }
    },
  },
  plugins: [],
}
