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
        cream: {
          DEFAULT: "#F5F0E6",
          dark: "#EFE9DF",
          light: "#FAF7F2",
        },
        chocolate: {
          DEFAULT: "#795548",
          dark: "#4A342E",
          hover: "#5D4037",
          light: "#8D6E63",
        },
        sawera: {
          bg: "#F5F0E6",
          card: "#FFFFFF",
          surface: "#EFE9DF",
          border: "#E4DDD3",
          borderLight: "#D9D0C3",
          gold: "#795548",
          goldLight: "#8D6E63",
          goldDark: "#4A342E",
          ivory: "#292D30",
          muted: "#6B635B",
          subtle: "#F9F6F0",
        },
      },
      fontFamily: {
        serif: ["Playfair Display", "Cinzel", "Georgia", "serif"],
        sans: ["Montserrat", "Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
      },
      letterSpacing: {
        luxury: "0.25em",
        brand: "0.35em",
      },
    },
  },
  plugins: [],
};
export default config;
