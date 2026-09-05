/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{html,js}",
    "./*.html"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Rioiz Signature Theme Palette
        rioiz: {
          primary: '#0f766e',     // Signature Deep Teal
          'primary-hover': '#115e59',
          'primary-dark': '#042f2e',
          accent: '#10b981',      // Mint / Emerald
          night: '#060810',       // Deepest Space Obsidian
          'night-card': '#0b1120',// Midnight Card Surface
          'night-elevated': '#111827',
          surface: '#f8fafc',
          heading: '#ffffff',
          muted: '#94a3b8',
          border: '#1e293b',
          'border-dark': '#0f172a'
        },
        brand: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
          950: '#042f2e',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        serif: ['"Source Serif 4"', 'Georgia', 'serif'],
      },
      boxShadow: {
        'rioiz-sm': '0 2px 8px rgba(0, 0, 0, 0.4)',
        'rioiz-md': '0 8px 30px rgba(0, 0, 0, 0.6)',
        'rioiz-lg': '0 20px 50px rgba(0, 0, 0, 0.8)',
        'rioiz-teal': '0 0 40px rgba(15, 118, 110, 0.35)',
        'rioiz-teal-lg': '0 0 70px rgba(20, 184, 166, 0.4)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'float 9s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'marquee': 'marquee 28s linear infinite',
        'spin-slow': 'spin 20s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        }
      }
    },
  },
  plugins: [],
}
