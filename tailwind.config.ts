import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./features/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ash: {
          DEFAULT: "#2F343A", // primary
          light: "#4A515A",
          dark: "#1F2327",
        },
        cloud: "#F5F5F5", // secondary
        paper: "#FAFAFA", // background
        ink: "#161616", // dark background
        accent: "#FFFFFF",
      },
      fontFamily: {
        heading: ["var(--font-poppins)", "sans-serif"],
        body: ["var(--font-inter)", "sans-serif"],
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
        "3xl": "2rem",
      },
      boxShadow: {
        soft: "0 4px 24px -8px rgba(47,52,58,0.12)",
        lift: "0 12px 40px -12px rgba(47,52,58,0.25)",
        glass: "0 8px 32px 0 rgba(31,35,39,0.18)",
      },
      backdropBlur: {
        xs: "2px",
      },
      letterSpacing: {
        tightest: "-0.04em",
        widest2: "0.28em",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        fadeUp: "fadeUp 0.7s ease forwards",
        marquee: "marquee 28s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
