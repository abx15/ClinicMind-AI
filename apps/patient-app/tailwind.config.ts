import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "../../packages/ui/src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#0F6E56",
          dark: "#094D3C",
          light: "#E1F5EE",
          medium: "#5DCAA5",
        },
        accent: {
          DEFAULT: "#1D63B5",
          light: "#E6F1FB",
        },
        warn: {
          DEFAULT: "#B86E0A",
          light: "#FEF3E2",
        },
        danger: {
          DEFAULT: "#A32D2D",
          light: "#FCEBEB",
        },
        purple: {
          DEFAULT: "#534AB7",
          light: "#EEEDFE",
        },
        sidebar: "#0B2920",
        card: "#FFFFFF",
        surface: "#F4F6F4",
        border: "#E2E8E4",
        text1: "#1A2420",
        text2: "#4A5E58",
        text3: "#8A9E98",
      },
      fontFamily: {
        sans: ["var(--font-dm-sans)", "DM Sans", "sans-serif"],
        heading: ["var(--font-syne)", "Syne", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
