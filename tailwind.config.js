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
          DEFAULT: "#FFDD00", // CustomerCamp Yellow
          50: "#FFFDF0",
          100: "#FFFBE0",
          200: "#FFF7C2",
          300: "#FFF3A3",
          400: "#FFEF85",
          500: "#FFEB66",
          600: "#FFE747",
          700: "#FFE329",
          800: "#FFDF0A",
          900: "#EBCB00",
        },
        secondary: {
          DEFAULT: "#6B46C1", // CustomerCamp Purple
          50: "#F2EEFB",
          100: "#E5DDF7",
          200: "#CCBBEF",
          300: "#B299E7",
          400: "#9977DF",
          500: "#8055D7",
          600: "#6B46C1",
          700: "#5A3BA3",
          800: "#493085",
          900: "#382567",
        },
        muted: {
          DEFAULT: "#F5F5F5",
          foreground: "#666666",
        },
        accent: {
          DEFAULT: "#FFDD00",
          foreground: "#222222",
        },
        success: "#10B981",
        info: "#3B82F6",
        warning: "#F59E0B",
        danger: "#EF4444",
        white: "#FFFFFF",
        black: "#222222",
        yellow: {
          DEFAULT: "#FFDD00",
          50: "#FFFDF0",
          100: "#FFFBE0",
          200: "#FFF7C2",
          300: "#FFF3A3",
          400: "#FFEF85",
          500: "#FFEB66",
          600: "#FFE747",
          700: "#FFE329",
          800: "#FFDF0A",
          900: "#EBCB00",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["Mada", ...fontFamily.sans],
      },
      boxShadow: {
        'card': '0 4px 20px -2px rgba(0, 0, 0, 0.08)',
        'card-hover': '0 8px 24px -2px rgba(0, 0, 0, 0.12)',
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "gradient": "gradient 8s ease infinite",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
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
        "gradient": {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
      },
      backgroundImage: {
        'gradient-dots': 'radial-gradient(circle, rgba(0, 0, 0, 0.1) 1px, transparent 1px)',
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      backdropBlur: {
        xs: '2px',
        sm: '4px',
        md: '12px',
        lg: '20px',
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
  ],
};  