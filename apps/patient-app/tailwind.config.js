/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/ui/src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0F6E56',
          dark:    '#094D3C',
          light:   '#E1F5EE',
          medium:  '#5DCAA5',
        },
        accent: {
          DEFAULT: '#1D63B5',
          light:   '#E6F1FB',
        },
        amber: {
          DEFAULT: '#B86E0A',
          light:   '#FEF3E2',
        },
        danger: {
          DEFAULT: '#A32D2D',
          light:   '#FCEBEB',
        },
        purple: {
          DEFAULT: '#534AB7',
          light:   '#EEEDFE',
        },
        sidebar: '#0B2920',
        card:    '#FFFFFF',
        'text-primary':   '#1A2420',
        'text-secondary': '#4A5E58',
        'text-muted':     '#8A9E98',
        border:           '#E2E8E4',
        background:       '#F4F6F4',
      },
      fontFamily: {
        sans:     ['var(--font-dm-sans)', 'sans-serif'],
        heading:  ['var(--font-syne)',    'sans-serif'],
        'dm-sans': ['var(--font-dm-sans)', 'sans-serif'],
        syne:     ['var(--font-syne)',    'sans-serif'],
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '20px',
        '4xl': '24px',
      },
      boxShadow: {
        card: '0 1px 3px rgba(0,0,0,0.06)',
        md:   '0 4px 16px rgba(0,0,0,0.08)',
        lg:   '0 8px 32px rgba(0,0,0,0.10)',
      },
    },
  },
  plugins: [],
}
