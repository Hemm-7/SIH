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
        border: "rgba(255, 255, 255, 0.08)",
        input: "rgba(255, 255, 255, 0.08)",
        ring: "#4FD1C5",
        background: "#081113",
        foreground: "#F3F7F6",
        primary: {
          DEFAULT: "#F3F7F6",
          foreground: "#081113",
        },
        secondary: {
          DEFAULT: "#0D181A",
          foreground: "#F3F7F6",
        },
        destructive: {
          DEFAULT: "#EF4444",
          foreground: "#FFFFFF",
        },
        muted: {
          DEFAULT: "#142124",
          foreground: "#9BAEAC",
        },
        accent: {
          DEFAULT: "#4FD1C5",
          foreground: "#081113",
        },
        popover: {
          DEFAULT: "#142124",
          foreground: "#F3F7F6",
        },
        card: {
          DEFAULT: "#142124",
          foreground: "#F3F7F6",
        },
        // Dark + Teal Design System Tokens
        tealTheme: {
          bg: "#081113",
          surface: "#0D181A",
          card: "#142124",
          elevated: "#19292B",
          textPrimary: "#F3F7F6",
          textSecondary: "#9BAEAC",
          textMuted: "#6F8381",
          teal: "#4FD1C5",
          tealBright: "#72E2D6",
          tealSoft: "#A8EEE7",
          border: "rgba(255, 255, 255, 0.08)",
          borderHover: "rgba(79, 209, 197, 0.3)",
        },
        status: {
          submitted: "#EAB308",
          "ai-matched": "#4FD1C5",
          claimed: "#38BDF8",
          "in-progress": "#818CF8",
          resolved: "#34D399",
        },
      },
      borderRadius: {
        xl: "0.875rem",
        "2xl": "1.125rem",
        "3xl": "1.5rem",
        lg: "0.875rem",
        md: "0.625rem",
        sm: "0.375rem",
      },
      fontFamily: {
        display: ["Plus Jakarta Sans", "Inter", "system-ui", "sans-serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "monospace"],
      },
      letterSpacing: {
        tightest: "-0.05em",
        tighter: "-0.035em",
      },
    },
  },
  plugins: [animate],
} satisfies Config;
