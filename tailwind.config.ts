import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: '#0a0b0f',
        surface: '#111318',
        surface2: '#181c25',
        border: 'rgba(255,255,255,0.07)',
        accent: '#4f9cf9',
        accent2: '#7c6ff7',
        success: '#34d399',
        warn: '#f59e0b',
        danger: '#f87171',
        'text-dim': '#9ca3af',
        'text-muted': '#6b7280',
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(135deg, #4f9cf9, #7c6ff7)',
        'gradient-ambient-1': 'radial-gradient(ellipse 70% 50% at 15% 0%, rgba(79,156,249,0.08) 0%, transparent 60%)',
        'gradient-ambient-2': 'radial-gradient(ellipse 60% 40% at 85% 100%, rgba(124,111,247,0.07) 0%, transparent 60%)',
      },
      boxShadow: {
        'glow-accent': '0 4px 20px rgba(79,156,249,0.25)',
        'glow-accent-lg': '0 6px 32px rgba(79,156,249,0.35)',
        'card': '0 1px 3px rgba(0,0,0,0.4)',
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4,0,0.6,1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        }
      }
    },
  },
  plugins: [],
}
export default config
