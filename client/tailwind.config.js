/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      colors: {
        vault: {
          950: '#0a0b12',
          900: '#0f111a',
          850: '#141824',
          800: '#1a1d2e',
          700: '#252a40',
          accent: '#7c3aed',
          glow: '#a78bfa',
        },
      },
      boxShadow: {
        glow: '0 0 40px -10px rgba(124, 58, 237, 0.45)',
        card: '0 4px 24px rgba(0,0,0,0.35)',
      },
      backgroundImage: {
        'grid-slate':
          'linear-gradient(to right, rgba(124,58,237,0.07) 1px, transparent 1px), linear-gradient(to bottom, rgba(124,58,237,0.07) 1px, transparent 1px)',
      },
      backgroundSize: {
        grid: '48px 48px',
      },
      animation: {
        shimmer: 'shimmer 2.2s ease-in-out infinite',
        float: 'float 6s ease-in-out infinite',
      },
      keyframes: {
        shimmer: {
          '0%, 100%': { opacity: '0.45' },
          '50%': { opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
    },
  },
  plugins: [],
};
