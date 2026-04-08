/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'cyber-black': '#020617',
        'cyber-navy': '#1e293b',
        'cyber-blue': '#3b82f6',
        'cyber-electric': '#0ea5e9',
      },
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
        'mono': ['JetBrains Mono', 'monospace'],
      },
      backdropBlur: {
        'sm': '4px',
        'md': '12px',
        'lg': '16px',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-in-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'pulse-cyber': 'pulseCyber 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        pulseCyber: {
          '0%, 100%': { boxShadow: '0 0 16px rgba(14, 165, 233, 0.5)' },
          '50%': { boxShadow: '0 0 32px rgba(14, 165, 233, 0.8)' },
        },
      },
    },
  },
  plugins: [],
}
