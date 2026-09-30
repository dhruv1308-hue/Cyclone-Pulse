/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        disaster: {
          dark: '#0a0f1d',
          card: '#111827',
          border: '#1f2937',
          accent: '#06b6d4',
          alert: '#ef4444',
          warning: '#f59e0b',
          safe: '#10b981',
          surge: '#38bdf8'
        }
      },
      animation: {
        'pulse-fast': 'pulse 1.2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 12s linear infinite',
      }
    },
  },
  plugins: [],
}
