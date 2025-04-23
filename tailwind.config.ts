
import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        apple: {
          silver: {
            DEFAULT: '#A2A3A5',   // Primary silver color
            light: '#C7C8CA',     // Lighter variant
            dark: '#74757A',      // Darker variant
          },
          gray: {
            background: '#E5E6E8', // Soft grey background
            text: '#3C3D3F',       // Dark text for contrast
          }
        },
        terminal: {
          ...require('tailwindcss/defaultTheme').colors.terminal,
          background: '#E5E6E8'    // Match apple grey background
        }
      },
      fontFamily: {
        'sans': ['Century Gothic', 'Arial', 'sans-serif']
      }
    }
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

