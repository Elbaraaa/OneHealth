import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#17232f",
        "public-teal": "#00796b",
        "public-blue": "#2364aa",
        "warm-gold": "#d99020",
        "soft-mint": "#e8f7f2",
        "soft-sky": "#eaf4ff",
      },
      boxShadow: {
        soft: "0 18px 60px rgba(23, 35, 47, 0.10)",
      },
    },
  },
  plugins: [],
};

export default config;
