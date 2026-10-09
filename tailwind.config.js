/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          // LilMed palette: deep clinical blue + fresh medical teal + growth green
          navy: "#0B3A6F",
          "navy-dark": "#062449",
          "navy-soft": "#1B5FA6",
          teal: "#0FB5B0",
          "teal-dark": "#087A78",
          green: "#22C08A",
          "green-dark": "#158A61",
          red: "#E4002B",
          gold: "#F5B841",
          cream: "#F3F8FB",
          ink: "#0B1220",
          charcoal: "#2E2E2E",
          // Legacy aliases kept for compatibility with eye2eye scaffolding
          orange: "#0FB5B0",
          "orange-dark": "#087A78",
          pink: "#22C08A",
        },
      },
      fontFamily: {
        display: ["'Playfair Display'", "'Cormorant Garamond'", "serif"],
        script: ["'Great Vibes'", "'Dancing Script'", "cursive"],
        editorial: ["'Playfair Display'", "system-ui", "sans-serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "grain": "radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)",
      },
      keyframes: {
        "float-slow": {
          "0%,100%": { transform: "translate3d(0,0,0)" },
          "50%":     { transform: "translate3d(0,-30px,0)" },
        },
        "drift": {
          "0%,100%": { transform: "translate3d(0,0,0) rotate(0deg)" },
          "50%":     { transform: "translate3d(30px,-20px,0) rotate(6deg)" },
        },
        "shimmer": {
          "0%":   { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "ticker": {
          "0%":   { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        "float-slow": "float-slow 8s ease-in-out infinite",
        "drift":      "drift 14s ease-in-out infinite",
        "shimmer":    "shimmer 3s linear infinite",
        "ticker":     "ticker 40s linear infinite",
      },
    },
  },
  plugins: [],
};
