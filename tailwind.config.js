/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#191D26',
        brand: { DEFAULT: '#0F6E64', deep: '#0A4F48', tint: '#E4EFEC' },
        paper: '#F4F5F2',
        hairline: '#E4E5E0',
        muted: '#6A6E76',
        grade: {
          'ext-strong': '#1B6E4B',
          strong: '#2F8A5F',
          moderate: '#C08A2E',
          weak: '#B5524A',
        },
      },
      fontFamily: {
        sans: ['"Public Sans"', 'system-ui', 'sans-serif'],
        serif: ['Newsreader', 'Georgia', 'serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
}
