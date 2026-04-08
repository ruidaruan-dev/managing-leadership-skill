import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: ["class"],
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        gold: {
          DEFAULT: "hsl(var(--gold))",
          dim: "hsl(var(--gold-dim))",
          glow: "hsl(var(--gold-glow))",
        },
        cyber: {
          DEFAULT: "hsl(var(--cyber))",
          dim: "hsl(var(--cyber-dim))",
        },
        danger: {
          DEFAULT: "hsl(var(--danger))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0", transform: "translateY(12px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "slide-up": {
          from: { opacity: "0", transform: "translateY(24px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "glow-pulse": {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "0.8" },
        },
        "scan-line": {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" },
        },
        "whip-swing": {
          "0%": { transform: "rotate(-30deg) scaleY(0)", opacity: "0" },
          "30%": { opacity: "1" },
          "50%": { transform: "rotate(0deg) scaleY(1)" },
          "100%": { transform: "rotate(15deg) scaleY(1.1)", opacity: "0.3" },
        },
        "pet-bounce": {
          "0%, 100%": { transform: "translateY(0)" },
          "20%": { transform: "translateY(-24px)" },
          "40%": { transform: "translateY(-4px)" },
          "60%": { transform: "translateY(-14px)" },
          "80%": { transform: "translateY(-2px)" },
        },
        "pet-shake": {
          "0%, 100%": { transform: "translateX(0)" },
          "10%": { transform: "translateX(-10px)" },
          "20%": { transform: "translateX(10px)" },
          "30%": { transform: "translateX(-8px)" },
          "40%": { transform: "translateX(8px)" },
          "50%": { transform: "translateX(-5px)" },
          "60%": { transform: "translateX(5px)" },
        },
        "pet-spin": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        "pet-shrink": {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(0.6)" },
        },
        "pain-star": {
          "0%": { transform: "scale(0) rotate(0deg)", opacity: "0" },
          "50%": { transform: "scale(1.3) rotate(180deg)", opacity: "1" },
          "100%": { transform: "scale(0.8) rotate(360deg)", opacity: "0" },
        },
        "bubble-pop": {
          "0%": { transform: "scale(0) translateY(10px)", opacity: "0" },
          "60%": { transform: "scale(1.1) translateY(-2px)", opacity: "1" },
          "100%": { transform: "scale(1) translateY(0)", opacity: "1" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.5s ease-out forwards",
        "slide-up": "slide-up 0.6s ease-out forwards",
        "glow-pulse": "glow-pulse 3s ease-in-out infinite",
        "scan-line": "scan-line 4s linear infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}

export default config