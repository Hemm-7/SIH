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
        // Challenge lifecycle. Keyed to public.challenge_status so a status value
        // maps straight to a colour without a lookup table in every component.
        status: {
          submitted: "hsl(var(--status-submitted))",
          "ai-matched": "hsl(var(--status-ai-matched))",
          claimed: "hsl(var(--status-claimed))",
          "in-progress": "hsl(var(--status-in-progress))",
          resolved: "hsl(var(--status-resolved))",
        },
      },
      borderRadius: {
        // Brutalist reskin: sharp everywhere, not derived via calc() off a
        // var that could clamp oddly at 0 — every step is just 0 outright.
        lg: "var(--radius)",
        md: "var(--radius)",
        sm: "var(--radius)",
      },
      fontFamily: {
        // Razorpay-AI-Builders reskin: oversized high-contrast serif for
        // headlines only, rigid mono for every functional/UI-chrome string
        // (buttons, labels, tickers, IDs), Inter kept for body copy a citizen
        // actually has to read at length — mono paragraphs would hurt real
        // legibility, and the spec's own accessibility carve-out backs that.
        display: ["Playfair Display", "Georgia", "serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "monospace"],
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        marquee: "marquee 22s linear infinite",
      },
    },
  },
  plugins: [animate],
} satisfies Config;
