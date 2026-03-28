import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    '../../packages/ui/src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#E1F5EE',
          100: '#C5EDE1',
          500: '#0F6E56',
          600: '#094D3C',
          700: '#0B2920',
        },
        accent: {
          blue: '#1D63B5',
          amber: '#B86E0A',
          red: '#A32D2D',
        },
        text: {
          primary: '#1A2420',
          secondary: '#4A5E58',
          muted: '#8A9E98',
        },
        border: '#E2E8E4',
        background: '#F4F6F4',
        card: '#FFFFFF',
      },
      fontFamily: {
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
        heading: ['Syne', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        card: '16px',
        component: '12px',
        button: '8px',
      },
    },
  },
  plugins: [],
}

export default config
