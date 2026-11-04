/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        charcoal: {
          950: "#090a0d",
          900: "#0e1015",
          850: "#13161d",
          800: "#1a1e27",
          700: "#242935",
          600: "#323846",
        },
        electric: {
          400: "#ff8533",
          500: "#ff6200",
          600: "#e65500",
          glow: "rgba(255, 98, 0, 0.4)",
        },
        warm: {
          50: "#fcfcfc",
          100: "#f5f5f4",
          200: "#e7e5e4",
          300: "#d6d3d1",
          400: "#a8a29e",
          500: "#78716c",
        },
      },
      fontFamily: {
        sans: ["var(--font-rajdhani)", "Inter", "sans-serif"],
        display: ["var(--font-orbitron)", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      boxShadow: {
        glow: "0 0 25px rgba(255, 98, 0, 0.25)",
        "glow-lg": "0 0 45px rgba(255, 98, 0, 0.35)",
        card: "0 4px 20px -2px rgba(0, 0, 0, 0.5)",
      },
      backgroundImage: {
        "grid-pattern": "linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px)",
        "radial-glow": "radial-gradient(circle at center, rgba(255, 98, 0, 0.15) 0%, transparent 70%)",
      },
    },
  },
  plugins: [],
};

