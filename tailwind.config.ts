import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: { "2xl": "1400px" },
    },
    extend: {
      colors: {
        border: "rgba(44, 41, 37, 0.18)",
        input: "rgba(44, 41, 37, 0.18)",
        ring: "#2C2925",
        background: "#ECE7DC",
        foreground: "#2C2925",
        primary: {
          DEFAULT: "#2C2925",
          foreground: "#ECE7DC",
        },
        secondary: {
          DEFAULT: "#DDD8CD",
          foreground: "#2C2925",
        },
        destructive: {
          DEFAULT: "#2C2925",
          foreground: "#ECE7DC",
        },
        muted: {
          DEFAULT: "#DDD8CD",
          foreground: "#5C564E",
        },
        accent: {
          DEFAULT: "#2C2925",
          foreground: "#ECE7DC",
        },
        popover: {
          DEFAULT: "#FAF8F4",
          foreground: "#2C2925",
        },
        card: {
          DEFAULT: "#FAF8F4",
          foreground: "#2C2925",
        },
      },
      borderRadius: {
        xl: "0.5rem",
        "2xl": "0.75rem",
        "3xl": "1rem",
        lg: "0.5rem",
        md: "0.375rem",
        sm: "0.25rem",
      },
      fontFamily: {
        serif: ["Times New Roman", "Times", "Playfair Display", "Georgia", "serif"],
        display: ["Times New Roman", "Times", "Playfair Display", "Georgia", "serif"],
        sans: ["Inter", "Plus Jakarta Sans", "system-ui", "sans-serif"],
        mono: ["Barlow Condensed", "JetBrains Mono", "ui-monospace", "monospace"],
      },
    },
  },
  plugins: [animate],
} satisfies Config;
