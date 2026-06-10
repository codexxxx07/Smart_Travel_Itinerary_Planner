/** @type {import('tailwindcss').Config} */
module.exports = {
  // Scan all HTML and JS files — Tailwind will purge any class not found here
  content: ["./*.{html,js}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        pastel: {
          blue:   "#a7c7e7",
          purple: "#c3b1e1",
          teal:   "#a8d8d8",
          pink:   "#f4c2c2",
          yellow: "#f7e7a3",
          green:  "#b5d3b5",
          peach:  "#ffdfd3",
          cream:  "#fef9f5",
        },
        clay: {
          bg:   "#f0f4f8",
          card: "#f7fafc",
        },
      },
      boxShadow: {
        "clay":          "8px 8px 16px #d1d9e6, -8px -8px 16px #ffffff",
        "clay-sm":       "4px 4px 8px #d1d9e6, -4px -4px 8px #ffffff",
        "clay-inset":    "inset 4px 4px 8px #d1d9e6, inset -4px -4px 8px #ffffff",
        "clay-inset-sm": "inset 2px 2px 4px #d1d9e6, inset -2px -2px 4px #ffffff",
        "clay-lg":       "12px 12px 24px #d1d9e6, -12px -12px 24px #ffffff",
      },
      animation: {
        "fade-in":     "fadeIn 0.6s ease-out forwards",
        "fade-in-up":  "fadeInUp 0.5s ease-out forwards",
        "float":       "float 6s ease-in-out infinite",
        "float-slow":  "float 8s ease-in-out infinite",
        "pulse-soft":  "pulseSoft 3s ease-in-out infinite",
        "spin-slow":   "spin 2s linear infinite",
        "blob":        "blob 8s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%":   { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeInUp: {
          "0%":   { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0) rotate(0deg)" },
          "50%":      { transform: "translateY(-20px) rotate(2deg)" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "0.4" },
          "50%":      { opacity: "0.8" },
        },
        blob: {
          "0%, 100%": { borderRadius: "60% 40% 30% 70% / 60% 30% 70% 40%" },
          "50%":      { borderRadius: "30% 60% 70% 40% / 50% 60% 30% 60%" },
        },
      },
    },
  },
  plugins: [],
};
