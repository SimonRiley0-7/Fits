import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        p: { DEFAULT: "var(--color-p)", h: "var(--color-p-h)", soft: "var(--color-p-soft)" },
        bg: { DEFAULT: "var(--color-bg)", surface: "var(--color-bg-surface)", soft: "var(--color-bg-soft)" },
        border: { DEFAULT: "var(--color-border)", strong: "var(--color-border-strong)" },
        tx: { DEFAULT: "var(--color-tx)", muted: "var(--color-tx-muted)", faint: "var(--color-tx-faint)" },
        success: { DEFAULT: "var(--color-success)" }
      },
      fontFamily: {
        display: ["var(--font-display)"],
        body:    ["var(--font-body)"],
      },
      boxShadow: {
        card:  "var(--shadow-card)",
        hover: "var(--shadow-hover)",
      },
      animation: {
        marquee: 'marquee 25s linear infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        }
      }
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
