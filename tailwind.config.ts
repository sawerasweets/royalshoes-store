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
        sawera: {
          bg: "#080808",
          card: "#111111",
          surface: "#171717",
          border: "#2A2A2A",
          borderLight: "#3D3D3D",
          gold: "#D4AF37",
          goldLight: "#E5C158",
          goldDark: "#A88720",
          ivory: "#F5F0E6",
          muted: "#9E9E9E",
          subtle: "#1C1C1C",
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
