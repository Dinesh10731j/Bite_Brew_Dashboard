import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./hooks/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#207659",
          deep: "#1a5a46",
          soft: "#ebf7f2",
          ink: "#0f2f24"
        }
      },
      boxShadow: {
        panel: "0 18px 50px rgba(14, 53, 42, 0.12)"
      },
      backgroundImage: {
        "panel-grid":
          "radial-gradient(circle at top, rgba(32,118,89,0.14), transparent 35%), linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)"
      }
    }
  },
  plugins: []
};

export default config;
