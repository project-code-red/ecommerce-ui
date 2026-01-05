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
          DEFAULT: "#1A73E8",
          hover: "#1557B0",
          active: "#1248A0",
          light: "#E8F0FE",
          "50": "#E8F0FE",
          "100": "#D0E1FD",
          "500": "#1A73E8",
          "600": "#1557B0",
          "700": "#1248A0",
        },
        secondary: {
          DEFAULT: "#111111",
          hover: "#2C2C2C",
          light: "#4A4A4A",
          "50": "#F5F5F5",
          "100": "#E5E5E5",
          "500": "#111111",
          "600": "#2C2C2C",
          "700": "#0A0A0A",
        },
        background: {
          DEFAULT: "#F8F9FA",
          secondary: "#FFFFFF",
          tertiary: "#E5E5E5",
        },
        accent: {
          DEFAULT: "#FF9800",
          hover: "#F57C00",
          active: "#E65100",
          light: "#FFF3E0",
          "50": "#FFF3E0",
          "100": "#FFE0B2",
          "500": "#FF9800",
          "600": "#F57C00",
          "700": "#E65100",
        },
        // Map gray colors to use secondary/background for consistency
        gray: {
          50: "#F8F9FA",
          100: "#E5E5E5",
          200: "#D0D0D0",
          300: "#B0B0B0",
          400: "#8A8A8A",
          500: "#6B6B6B",
          600: "#4A4A4A",
          700: "#2C2C2C",
          800: "#1A1A1A",
          900: "#111111",
        },
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        'card-hover': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        '3xl': '0 35px 60px -12px rgba(0, 0, 0, 0.3)',
      },
      transitionProperty: {
        'height': 'height',
        'spacing': 'margin, padding',
      },
    },
  },
  plugins: [],
};

export default config;

