import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Montserrat', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      colors: {
        // Professional dark theme for web3
        background: '#0a0a0a',
        surface: {
          DEFAULT: '#111111',
          elevated: '#1a1a1a',
        },
        border: {
          DEFAULT: '#2a2a2a',
          hover: '#3a3a3a',
        },
        text: {
          primary: '#ffffff',
          secondary: '#a3a3a3',
          muted: '#737373',
        },
        primary: '#ffffff',
        secondary: '#a855f7',
        accent: '#3b82f6',
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #3b82f6, #a855f7)',
        'gradient-secondary': 'linear-gradient(135deg, #10b981, #3b82f6)',
        'gradient-accent': 'linear-gradient(135deg, #a855f7, #ec4899)',
      },
      boxShadow: {
        'dark-sm': '0 1px 2px 0 rgb(0 0 0 / 0.3)',
        'dark-md': '0 4px 6px -1px rgb(0 0 0 / 0.4)',
        'dark-lg': '0 10px 15px -3px rgb(0 0 0 / 0.5)',
        'glow-blue': '0 0 20px rgb(59 130 246 / 0.3)',
        'glow-purple': '0 0 20px rgb(168 85 247 / 0.3)',
      },
      borderRadius: {
        'clean': '8px',
        'clean-lg': '12px',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'shimmer': 'shimmer 1.5s infinite',
      },
      keyframes: {
        fadeIn: {
          'from': { opacity: '0' },
          'to': { opacity: '1' },
        },
        slideUp: {
          'from': { 
            opacity: '0', 
            transform: 'translateY(20px)' 
          },
          'to': { 
            opacity: '1', 
            transform: 'translateY(0)' 
          },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      backdropBlur: {
        'xs': '2px',
      },
    },
  },
  plugins: [],
};

export default config;