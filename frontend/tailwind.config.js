/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Government Core
        'gov-navy': {
          DEFAULT: '#0A1A2F',
          light: '#1A2E4A',
          dark: '#050D18',
        },
        'gov-saffron': {
          DEFAULT: '#FF9933',
          dark: '#E68A2E',
          light: '#FFAD5C',
        },
        'saffron-dark': '#E68A2E',
        // Surfaces
        surface: {
          white: '#FFFFFF',
          light: '#F7F8FA',
          subtle: '#EEF0F4',
          muted: '#E1E4EA',
        },
        // Text
        secondary: '#4A5568',
        muted: '#718096',
        // Borders
        'border-light': '#E2E8F0',
        'border-default': '#CBD5E0',
        // Status
        status: {
          success: '#22C55E',
          warning: '#EAB308',
          error: '#EF4444',
          info: '#3B82F6',
        },
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      },
      borderRadius: {
        'md': '0.375rem',
        'lg': '0.5rem',
      },
      boxShadow: {
        'sm': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        'md': '0 4px 6px -1px rgb(0 0 0 / 0.1)',
        'lg': '0 10px 15px -3px rgb(0 0 0 / 0.1)',
        'gov': '0 4px 20px -2px rgb(10 26 47 / 0.15)',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'fade-out': 'fadeOut 0.5s ease-out forwards',
        'slide-up': 'slideUp 0.6s ease-out forwards',
        'scale-x': 'scaleX 0.8s ease-out forwards',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'spin-slow': 'spin 30s linear infinite',
        'float': 'float 10s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleX: {
          '0%': { transform: 'scaleX(0)' },
          '100%': { transform: 'scaleX(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0) translateX(0)' },
          '25%': { transform: 'translateY(-20px) translateX(10px)' },
          '50%': { transform: 'translateY(-10px) translateX(-10px)' },
          '75%': { transform: 'translateY(-30px) translateX(5px)' },
        },
      },
    },
  },
  plugins: [],
}
