/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{html,tsx}',
  ],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        // Neural Insight Palette
        accent: {
          primary: 'var(--accent-primary)',
          secondary: 'var(--accent-secondary)',
          tertiary: 'var(--accent-tertiary)',
        },
        surface: {
          primary: 'var(--bg-primary)',
          secondary: 'var(--bg-secondary)',
          tertiary: 'var(--bg-tertiary)',
          panel: 'var(--bg-panel)',
        },
        // Visualization colors
        viz: {
          embedding: '#c084fc',
          attention: '#fb923c',
          mlp: '#22d3d8',
          softmax: '#4ade80',
          layernorm: '#fbbf24',
          output: '#f472b6',
        },
        // Slate tones for dark mode
        slate: {
          950: '#0f172a',
          900: '#1e293b',
          800: '#334155',
          700: '#475569',
          600: '#64748b',
          500: '#94a3b8',
        },
        // Indigo/violet for accents
        indigo: {
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
        },
        violet: {
          400: '#a78bfa',
          500: '#8b5cf6',
        },
        cyan: {
          400: '#22d3ee',
          500: '#06b6d4',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Source Serif 4', 'Georgia', 'serif'],
        mono: ['JetBrains Mono', 'Consolas', 'monospace'],
      },
      boxShadow: {
        'glow': '0 0 20px rgba(99, 102, 241, 0.15)',
        'glow-lg': '0 0 30px rgba(129, 140, 248, 0.2)',
        'inner-glow': 'inset 0 0 20px rgba(129, 140, 248, 0.1)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(ellipse at center, var(--tw-gradient-stops))',
        'gradient-neural': 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
        'gradient-accent': 'linear-gradient(135deg, #818cf8 0%, #a78bfa 100%)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
}
