/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'burgundy': '#5c1a1a',
        'burgundy-dark': '#3d1010',
        'red': '#9b1c1c',
        'red-dark': '#7a1515',
        'red-light': '#c42b2b',
        'red-bg': '#fdf2f2',
        'cream': '#f4f1ec',
        'border': '#e8e4de',
      },
      fontFamily: {
        serif: ['Cormorant Garamond', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
