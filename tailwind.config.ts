import type { Config } from 'tailwindcss'

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Note: Tailwind v4 (CSS-first) does NOT read `screens` from this config.
      // Standard breakpoints are always available:
      //   sm:  640px  (mobile landscape)
      //   md:  768px  (tablet / iPad)
      //   lg:  1024px (iPad Pro / small laptop)
      //   xl:  1280px (laptop)
      //   2xl: 1536px (desktop)
      // For custom iPad-specific styles, use regular CSS @media queries in index.css.
      spacing: {
        "sidebar": "16rem",    // 256px - sidebar width
        "topbar": "4rem",      // 64px - topbar height
      },
    },
  },
  plugins: [],
} satisfies Config
