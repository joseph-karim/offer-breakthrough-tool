import { fontFamily } from "tailwindcss/defaultTheme";

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  safelist: [
    // Basic colors that might be used with @apply
    'bg-white',
    'bg-black',
    'bg-gray-100',
    'bg-gray-200',
    'text-white',
    'text-black',
    'border-white',
    'border-black',
    'from-white',
    'to-white',
    // Brand colors
    'bg-brand-yellow',
    'text-brand-yellow',
    'border-brand-yellow',
    'bg-brand-black',
    'text-brand-black',
    'border-brand-black',
    'bg-brand-purple',
    'text-brand-purple',
    'border-brand-purple',
    // Backdrop filters
    'backdrop-blur-md',
    'backdrop-blur-lg',
    'backdrop-blur-sm',
    // Opacity utilities
    'bg-opacity-10',
    'bg-opacity-20',
    'bg-opacity-30',
    'bg-opacity-40',
    'bg-opacity-50',
    'bg-opacity-60',
    'bg-opacity-70',
    'bg-opacity-80',
    'bg-opacity-90',
    'border-opacity-10',
    'border-opacity-20',
    'border-opacity-30',
    'border-opacity-40',
    'border-opacity-50',
    'shadow-opacity-40',
    'shadow-opacity-50'
  ],
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
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        // Brand colors matching learnwhybuy.com
        brand: {
          yellow: "#FFDD00",
          black: "#222222",
          purple: "#6B46C1",
        },
        gray: {
          50: "#f9fafb",
          100: "#f3f4f6",
          200: "#e5e7eb",
          300: "#d1d5db",
          400: "#9ca3af",
          500: "#6b7280",
          600: "#4b5563",
          700: "#374151",
          800: "#1f2937",
          900: "#111827",
          950: "#030712",
        },
        primary: {
          DEFAULT: "#FFDD00", // Brand Yellow
          foreground: "#222222", // Black text on yellow background
        },
        secondary: {
          DEFAULT: "#222222", // Brand Black
          foreground: "#FFFFFF", // White text on black background
        },
        accent: {
          DEFAULT: "#6B46C1", // Brand Purple
          foreground: "#FFFFFF", // White text on purple background
        },
        muted: {
          DEFAULT: "#F5F5F5",
          foreground: "#666666",
        },
        success: "#10B981",
        info: "#3B82F6",
        warning: "#F59E0B",
        danger: "#EF4444",
        white: "#FFFFFF",
        black: "#222222",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["Mada", ...fontFamily.sans],
        display: ["Vintage Moon", ...fontFamily.sans],
      },
      boxShadow: {
        'card': '0 4px 20px -2px rgba(0, 0, 0, 0.08)',
        'card-hover': '0 8px 24px -2px rgba(0, 0, 0, 0.12)',
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
  ],
};  