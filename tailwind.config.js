/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Background layers
        'app-bg': '#0B1F20',
        'glass': 'rgba(18,42,44,0.55)',
        'glass-elevated': 'rgba(22,52,54,0.72)',
        // Text
        'primary-text': '#E9F3F1',
        'muted-text': '#9CB3B1',
        'faint-text': '#6F8584',
        // Accents
        'brand-teal': '#2DD4BF',
        'brand-cyan': '#22D3EE',
        // Grade colours (glowing on dark)
        'grade-ext-strong': '#34D399',
        'grade-strong': '#2DD4BF',
        'grade-moderate': '#FBBF24',
        'grade-weak': '#FB7185',
        // Data viz
        'viz-teal': '#2DD4BF',
        'viz-sky': '#38BDF8',
        'viz-green': '#34D399',
        'viz-amber': '#FBBF24',
        'viz-orange': '#FB923C',
        'viz-violet': '#A78BFA',
        // Legacy aliases (keep so existing code doesn't break)
        ink: '#0B1F20',
        brand: { DEFAULT: '#2DD4BF', deep: '#0A4F48', tint: 'rgba(45,212,191,0.12)' },
        paper: '#0B1F20',
        hairline: 'rgba(255,255,255,0.07)',
        muted: '#9CB3B1',
        grade: {
          'ext-strong': '#34D399',
          strong: '#2DD4BF',
          moderate: '#FBBF24',
          weak: '#FB7185',
        },
      },
      fontFamily: {
        sans: ['"Public Sans"', 'system-ui', 'sans-serif'],
        serif: ['Newsreader', 'Georgia', 'serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      backgroundImage: {
        'app-gradient': 'linear-gradient(135deg, #0C2C2B 0%, #0B2024 50%, #08161A 100%)',
        'glass-gradient': 'linear-gradient(135deg, rgba(45,212,191,0.08) 0%, rgba(34,211,238,0.04) 100%)',
        'btn-gradient': 'linear-gradient(135deg, #2DD4BF 0%, #22D3EE 100%)',
        'ring-gradient': 'linear-gradient(135deg, #2DD4BF, #22D3EE)',
      },
      boxShadow: {
        'glass': '0 12px 34px rgba(0,0,0,0.38), inset 0 1px 0 rgba(255,255,255,0.06)',
        'glass-hover': '0 20px 48px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.10)',
        'glow-teal': '0 6px 20px rgba(45,212,191,0.35)',
        'glow-teal-lg': '0 0 40px rgba(45,212,191,0.25)',
        'btn-glow': '0 6px 20px rgba(45,212,191,0.4)',
      },
      backdropBlur: {
        glass: '18px',
      },
      borderRadius: {
        glass: '18px',
        'glass-lg': '22px',
      },
      keyframes: {
        fadeSlideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(45,212,191,0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(45,212,191,0.6)' },
        },
        drawRing: {
          from: { strokeDashoffset: '999' },
          to: {},
        },
        countUp: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
      },
      animation: {
        'fade-slide-up': 'fadeSlideUp 0.5s ease-out forwards',
        'float': 'float 4s ease-in-out infinite',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
        'draw-ring': 'drawRing 1.2s ease-out forwards',
      },
    },
  },
  plugins: [],
}
