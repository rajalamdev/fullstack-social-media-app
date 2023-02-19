/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}", // Note the addition of the `app` directory.
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    // container: {
    //   screens: {
    //     sm: '640px',
    //     md: '768px',
    //     lg: '1024px',
    //     xl: '1440px',
    //   },
    //   center: true,
    //   padding: {
    //     // DEFAULT: '1rem',
    //     // sm: '2rem',
    //     // lg: '4rem',
    //     // xl: '5rem',
    //     // '2xl': '6rem',
    //   },
    // },
    extend: {
      colors: {
        'bg-primary': 'var(--bg-primary)',
        'text-primary': 'var(--text-primary)',
        'text-secondary': 'var(--text-secondary)',
        'nav-primary': 'var(--nav-primary)',
        'border-primary': 'var(--border-primary)',
        'text-third': 'var(--text-third)',
        'border-secondary': 'var(--border-secondary)',
        'bg-hover': 'var(--bg-hover)',
        'header-primary': 'var(--header-primary)'
      },
    },
  },
  plugins: [],
}


