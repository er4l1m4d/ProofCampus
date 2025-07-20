import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f4ff',
          100: '#e0e9ff',
          200: '#c7d6ff',
          300: '#a3b8ff',
          400: '#7b91ff',
          500: '#5b6bff',
          600: '#4a4fff',
          700: '#3f3fd1',
          800: '#3535a8',
          900: '#2f2f85',
          DEFAULT: '#072A6C',
          light: '#0d3a8a',
          dark: '#051a4a',
        },
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        playfair: ['var(--font-playfair)', 'serif'],
      },
    },
  },
  plugins: [],
};

export default config; 