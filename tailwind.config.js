export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        medical: {
          50: '#eefdfb',
          100: '#d5faf5',
          500: '#14b8a6',
          700: '#0f766e',
        },
      },
      keyframes: {
        shimmer: {
          '0%':   { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
        'ring-pulse': {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.6' },
          '50%':      { transform: 'scale(1.15)', opacity: '0' },
        },
      },
      animation: {
        shimmer:     'shimmer 2s linear infinite',
        'ring-pulse': 'ring-pulse 1.5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
