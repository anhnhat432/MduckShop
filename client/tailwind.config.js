const fallbackSans = [
  "ui-sans-serif",
  "system-ui",
  "-apple-system",
  "BlinkMacSystemFont",
  "Segoe UI",
  "sans-serif",
];

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#020617",
          900: "#0f172a",
          800: "#172033",
        },
        volt: {
          DEFAULT: "#B8FF20",
          200: "#DEFF94",
          400: "#C8FF51",
          500: "#B8FF20",
          700: "#76B200",
        },
        electric: {
          DEFAULT: "#38BDF8",
          200: "#BAE6FD",
          400: "#38BDF8",
          700: "#0369A1",
        },
        sand: {
          50: "#FCFAF5",
          100: "#F5F0E6",
          200: "#E7DCC7",
        },
      },
      fontFamily: {
        sans: ["Inter", ...fallbackSans],
        display: ["Poppins", ...fallbackSans],
      },
      boxShadow: {
        premium: "0 28px 90px -38px rgba(15, 23, 42, 0.42)",
        hero: "0 40px 120px -44px rgba(2, 6, 23, 0.7)",
        glow: "0 0 0 1px rgba(184, 255, 32, 0.18), 0 24px 60px -28px rgba(56, 189, 248, 0.28)",
      },
      backgroundImage: {
        "radial-premium": "radial-gradient(circle at top left, rgba(56, 189, 248, 0.22), transparent 28%), radial-gradient(circle at 82% 18%, rgba(184, 255, 32, 0.18), transparent 22%), linear-gradient(135deg, rgba(15, 23, 42, 0.96), rgba(15, 23, 42, 0.82))",
        mesh: "linear-gradient(135deg, rgba(255,255,255,0.86), rgba(255,255,255,0.62)), radial-gradient(circle at top, rgba(184,255,32,0.18), transparent 32%), radial-gradient(circle at bottom right, rgba(56,189,248,0.18), transparent 28%)",
        "shoe-stage": "linear-gradient(145deg, #f8fafc 0%, #ffffff 42%, #e2e8f0 100%)",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        "grid-drift": {
          "0%": { transform: "translate3d(0, 0, 0)" },
          "50%": { transform: "translate3d(-18px, 14px, 0)" },
          "100%": { transform: "translate3d(0, 0, 0)" },
        },
        sheen: {
          "0%": { transform: "translateX(-140%) skewX(-18deg)" },
          "100%": { transform: "translateX(240%) skewX(-18deg)" },
        },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        "grid-drift": "grid-drift 16s ease-in-out infinite",
        sheen: "sheen 1.2s ease forwards",
      },
    },
  },
  plugins: [],
};
