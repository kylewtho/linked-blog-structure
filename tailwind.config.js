/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./components/**/*.tsx", "./pages/**/*.tsx"],
  theme: {
    fontFamily: {
      sans: [
        "var(--font-geist-sans)",
        "-apple-system",
        "BlinkMacSystemFont",
        '"Segoe UI"',
        "Helvetica",
        "Arial",
        "sans-serif",
      ],
      mono: [
        "var(--font-geist-mono)",
        "ui-monospace",
        "SFMono-Regular",
        "monospace",
      ],
    },
    extend: {
      colors: {
        "accent-1": "#FAFAFA",
        "accent-2": "#EAEAEA",
        "accent-7": "#333",
        success: "#0070f3",
        cyan: "#79FFE1",
        // DESIGN.md tokens
        "vercel-black": "#171717",
        "vercel-gray": "#4d4d4d",
      },
      spacing: {
        28: "7rem",
      },
      letterSpacing: {
        tighter: "-.04em",
        // DESIGN.md: size-aware negative tracking
        display: "-0.05em", // h1 ≈ -2.4px at 48px
        heading: "-0.04em", // h2/h3 ≈ -1.28px at 32px
        subheading: "-0.03em", // h4 ≈ -0.96px at 24px
      },
      lineHeight: {
        tight: 1.2,
      },
      fontSize: {
        "5xl": "2.5rem",
        "6xl": "2.75rem",
        "7xl": "4.5rem",
        "8xl": "6.25rem",
      },
      boxShadow: {
        sm: "0 5px 10px rgba(0, 0, 0, 0.12)",
        md: "0 8px 30px rgba(0, 0, 0, 0.12)",
        // DESIGN.md shadow system
        border: "0px 0px 0px 1px rgba(0,0,0,0.08)",
        card: "0px 0px 0px 1px rgba(0,0,0,0.08), 0px 2px 2px rgba(0,0,0,0.04), 0px 0px 0px 1px #fafafa",
      },
    },
  },
  plugins: [],
};
