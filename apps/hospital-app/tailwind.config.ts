import type { Config } from 'tailwindcss'
import path from 'path'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './hooks/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
    './providers/**/*.{js,ts,jsx,tsx,mdx}',
    './stores/**/*.{js,ts,jsx,tsx,mdx}',
    path.join(__dirname, '../../packages/ui/src/**/*.{js,ts,jsx,tsx,mdx}'),
  ],
  theme: {
    extend: {
      colors: {
        primary:  { DEFAULT: '#0F6E56', dark: '#094D3C', light: '#E1F5EE', medium: '#5DCAA5' },
        accent:   { DEFAULT: '#1D63B5', light: '#E6F1FB' },
        warn:     { DEFAULT: '#B86E0A', light: '#FEF3E2' },
        danger:   { DEFAULT: '#A32D2D', light: '#FCEBEB' },
        purple:   { DEFAULT: '#534AB7', light: '#EEEDFE' },
        sidebar:  '#0B2920',
        'text-1': '#1A2420',
        'text-2': '#4A5E58',
        'text-3': '#8A9E98',
        border:   '#E2E8E4',
        surface:  '#F4F6F4',
        card:     '#FFFFFF',
      },
      fontFamily: {
        sans:    ['var(--font-dm-sans)', 'DM Sans', 'sans-serif'],
        heading: ['var(--font-syne)', 'Syne', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '20px',
        '4xl': '24px',
      },
      boxShadow: {
        card: '0 1px 3px rgba(0,0,0,0.06)',
        md:   '0 4px 16px rgba(0,0,0,0.08)',
        lg:   '0 8px 32px rgba(0,0,0,0.12)',
      },
      screens: {
        xs: '375px',
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
      },
    },
  },
  plugins: [],
}

export default config
