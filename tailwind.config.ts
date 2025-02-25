import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        parchment: '#f5e8c7',
        ink: '#3c2f2f',
        gold: '#d4af37',
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        medieval: ['Cinzel', 'serif'],
      },
    },
  },
  plugins: [],
} satisfies Config;
