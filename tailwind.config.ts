// tailwind.config.ts
import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";
import type { PluginAPI } from "tailwindcss/types/config";

type ThemeUtil = Pick<PluginAPI, "theme">;

const config: Config = {
  strongMode: ["class", '[data-theme="strong"]'],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./styles/**/*.css",
    "./src/styles/**/*.css",
    "./stories/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: ["fs-hide", "fs-mask", "fs-exclude", "fs-unmask"],
  theme: {
    fontSize: {
      xxs: "var(--font-size-xxs)",
      xs: "var(--font-size-xs)",
      sm: "var(--font-size-sm)",
      base: "var(--font-size-base)",
      lg: "var(--font-size-lg)",
      xl: "var(--font-size-xl)",
      "2xl": "var(--font-size-2xl)",
      "3xl": "var(--font-size-3xl)",
      "4xl": "var(--font-size-4xl)",
    },
    lineHeight: {
      null: "var(--line-height-none)",
      none: "var(--line-height-none)",
      tight: "var(--line-height-tight)",
      snug: "var(--line-height-snug)",
      normal: "var(--line-height-normal)",
      relaxed: "var(--line-height-relaxed)",
      loose: "var(--line-height-loose)",
    },
    fontWeight: {
      thin: "var(--font-weight-thin)",
      light: "var(--font-weight-light)",
      normal: "var(--font-weight-normal)",
      medium: "var(--font-weight-medium)",
      semibold: "var(--font-weight-semibold)",
      bold: "var(--font-weight-bold)",
      black: "var(--font-weight-black)",
    },
    letterSpacing: {
      tighter: "var(--letter-spacing-tighter)",
      tight: "var(--letter-spacing-tight)",
      normal: "var(--letter-spacing-normal)",
      wide: "var(--letter-spacing-wide)",
      wider: "var(--letter-spacing-wider)",
      widest: "var(--letter-spacing-widest)",
    },
    extend: {
      colors: {

        // Text colors (no prefix for utility `text-{value}`)
        strong: "var(--text-strong)",
        foreground: "var(--text-foreground)",
        weak: "var(--text-weak)",
        muted: "var(--text-muted)",
        inverse: "var(--text-inverse)",
        icon: "var(--text-weak)",

        // Background colors (will use `bg-{value}`)
        body: "var(--background-page)",
        input: "var(--background-input)",
        disabled: "var(--background-disabled)",
        surface: {
          DEFAULT: "var(--background-surface)",
          hover: "var(--background-surface-sunken)",
          raised: "var(--background-surface-raised)",
          elevated: "var(--background-surface-elevated)",
          sunken: "var(--background-surface-sunken)",
          hollowed: "var(--background-surface-hollowed)",
        },
      },

      maxWidth: {
        "copy-xxs": "var(--max-width-copy-xxs)",
        "copy-xs": "var(--max-width-copy-xs)",
        "copy-sm": "var(--max-width-copy-sm)",
        copy: "var(--max-width-copy-base)",
        "copy-lg": "var(--max-width-copy-lg)",
        "copy-xl": "var(--max-width-copy-xl)",
      },
      spacing: {
        xxs: "var(--space-xxs)",
        xs: "var(--space-xs)",
        sm: "var(--space-sm)",
        base: "var(--space-base)",
        md: "var(--space-md)",
        lg: "var(--space-lg)",
        xl: "var(--space-xl)",
        "2xl": "var(--space-2xl)",
        "3xl": "var(--space-3xl)",
        "4xl": "var(--space-4xl)",
      },
      borderRadius: {
        sm: "var(--radius-sm)",
        base: "var(--radius-base)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
        pill: "var(--radius-pill)",
      },
      boxShadow: {
        sm: "var(--shadow-sm)",
        DEFAULT: "var(--shadow-base)",
        md: "var(--shadow-md)",
        lg: "var(--shadow-lg)",
        "2xl": "var(--shadow-2xl)",
      },
      fontSize: {
        base: '14px', // Set the base font size to 14px
      },
      fontFamily: {
        sans: "var(--font-family-sans)",
        mono: "var(--font-family-mono)",
      },
      opacity: {
        disabled: "var(--disabled-opacity)",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    require("tailwind-scrollbar"),

    // Animation utilities plugin
    plugin(({ addUtilities }) => {
      addUtilities({
        ".animate-in": {
          "animation-duration": "var(--duration-normal)",
          "animation-timing-function": "var(--ease-out)",
          "animation-fill-mode": "forwards",
        },
        ".animate-out": {
          "animation-duration": "var(--duration-normal)",
          "animation-timing-function": "var(--ease-in)",
          "animation-fill-mode": "forwards",
        },
      });
    }),

    // Focus and accessibility utilities
    plugin(({ addUtilities }) => {
      addUtilities({
        ".focus-ring": {
          "@apply outline-none ring-2 ring-offset-2": {},
          "ring-color": "var(--ring-primary)",
          "ring-offset-color": "var(--background-surface)",
        },
        ".focus-ring-danger": {
          "@apply outline-none ring-2 ring-offset-2": {},
          "ring-color": "var(--ring-danger)",
          "ring-offset-color": "var(--background-surface)",
        },
      });
    }),

    // Reduced motion preferences
    plugin(({ addUtilities }) => {
      addUtilities({
        "@media (prefers-reduced-motion: reduce)": {
          ".animate-in, .animate-out": {
            animation: "none !important",
          },
          ".transition": {
            transition: "none !important",
          },
        },
      });
    }),
  ],
};

export default config;
