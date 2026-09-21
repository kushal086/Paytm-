/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        paytm: {
          50: '#eef7ff',
          100: '#d9edff',
          200: '#bce0ff',
          300: '#8ecdff',
          400: '#59b0ff',
          500: '#3390ff',
          600: '#0f6fdb',
          700: '#00baf2',
          blue: '#002970',
          sky: '#00baf2',
          navy: '#012970',
          ink: '#0b1b34',
        },
        ink: {
          900: '#0b1b34',
          700: '#26385a',
          500: '#5a6b88',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(11,27,52,0.04), 0 6px 20px -8px rgba(11,27,52,0.10)',
        lift: '0 2px 4px rgba(11,27,52,0.05), 0 18px 40px -18px rgba(11,27,52,0.28)',
        ring: '0 0 0 4px rgba(0,186,242,0.14)',
      },
      keyframes: {
        'fade-up': { '0%': { opacity: 0, transform: 'translateY(8px)' }, '100%': { opacity: 1, transform: 'none' } },
        'fade-in': { '0%': { opacity: 0 }, '100%': { opacity: 1 } },
        'scale-in': { '0%': { opacity: 0, transform: 'scale(.96)' }, '100%': { opacity: 1, transform: 'scale(1)' } },
        'pop': { '0%': { transform: 'scale(.4)', opacity: 0 }, '60%': { transform: 'scale(1.08)', opacity: 1 }, '100%': { transform: 'scale(1)' } },
        'slide-in-right': { '0%': { opacity: 0, transform: 'translateX(20px)' }, '100%': { opacity: 1, transform: 'none' } },
        'grow-x': { '0%': { transform: 'scaleX(0)' }, '100%': { transform: 'scaleX(1)' } },
        'shimmer': { '100%': { transform: 'translateX(100%)' } },
      },
      animation: {
        'fade-up': 'fade-up .45s cubic-bezier(.2,.8,.2,1) both',
        'fade-in': 'fade-in .35s ease both',
        'scale-in': 'scale-in .25s cubic-bezier(.2,.8,.2,1) both',
        'pop': 'pop .5s cubic-bezier(.2,1.2,.3,1) both',
        'slide-in-right': 'slide-in-right .35s cubic-bezier(.2,.8,.2,1) both',
        'grow-x': 'grow-x .9s cubic-bezier(.2,.8,.2,1) both',
        shimmer: 'shimmer 1.4s infinite',
      },
    },
  },
  plugins: [],
}
