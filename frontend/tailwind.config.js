/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "emerald-brand": "#059669",
        "emerald-bright": "#10B981",
        "emerald-glow": "#34D399",
        "emerald-subtle": "#D1FAE5",
        "stone-dark": "#1C1917",
        "stone-subtle": "#57534E",
        "stone-border": "#E7E5E4",
        "cream-surface": "#FDFBF7",
        "alabaster": "#F8FAFC",
        "slateInk": "#0F172A",
        "slateSec": "#475569",
        "slateMuted": "#94A3B8",
        "emeraldAccent": "#10B981",
        "terracotta": "#D97706",
        "mutedViolet": "#8B5CF6",
      },
      fontFamily: {
        "label-code": ["JetBrains Mono", "monospace"],
        "headline": ["Epilogue", "sans-serif"],
        "sans": ["Public Sans", "sans-serif"],
        "action-cta": ["JetBrains Mono", "monospace"],
        "paprika": ["Paprika", "cursive", "sans-serif"],
        "mono": ['"JetBrains Mono"', "monospace"],
      },
      spacing: {
        "unit-1": "0.25rem",
        "unit-2": "0.5rem",
        "unit-3": "0.75rem",
        "unit-4": "1rem",
        "unit-6": "1.5rem",
        "unit-8": "2rem",
        "unit-10": "2.5rem",
        "unit-12": "3rem",
        "unit-16": "4rem",
        "unit-20": "5rem",
        "unit-24": "6rem",
        "grid-margin": "2rem",
      }
    },
  },
  plugins: [],
}
