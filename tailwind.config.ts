import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";
import type { PluginAPI } from "tailwindcss/types/config";

type ThemeUtil = Pick<PluginAPI, 'theme'>;

const config: Config = {
  darkMode: ["class", '[data-theme="dark"]'],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    fontSize: {
      'xxs': ['11px', { lineHeight: '1.5' }],
      'xs': ['12px', { lineHeight: '1.5' }],
      'sm': ['13px', { lineHeight: '1.5' }],
      'base': ['15px', { lineHeight: '1.5' }],
      'lg': ['17px', { lineHeight: '1.5' }],
      'xl': ['21px', { lineHeight: '1.375' }],
      '2xl': ['24px', { lineHeight: '1.375' }],
      '3xl': ['27px', { lineHeight: '1.25' }],
      '4xl': ['30px', { lineHeight: '1.25' }],
    },
    lineHeight: {
      'null': '0',
      'none': '1',
      'tight': '1.25',
      'snug': '1.375',
      'normal': '1.5',
      'relaxed': '1.625',
      'loose': '2',
    },
    fontWeight: {
      'thin': '200',
      'light': '300',
      'normal': '400',
      'medium': '500',
      'semibold': '600',
      'bold': '700',
      'black': '900',
    },
    letterSpacing: {
      'tighter': '-0.05em',
      'tight': '-0.025em',
      'normal': '0',
      'wide': '0.025em',
      'wider': '0.05em',
      'widest': '0.25em',
    },
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          25: "rgb(var(--primary-25))",
          50: "rgb(var(--primary-50))",
          100: "rgb(var(--primary-100))",
          200: "rgb(var(--primary-200))",
          300: "rgb(var(--primary-300))",
          400: "rgb(var(--primary-400))",
          500: "rgb(var(--primary-500))",
          600: "rgb(var(--primary-600))",
          700: "rgb(var(--primary-700))",
          800: "rgb(var(--primary-800))",
          900: "rgb(var(--primary-900))",
          950: "rgb(var(--primary-950))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
          25: "rgb(var(--accent-25))",
          50: "rgb(var(--accent-50))",
          100: "rgb(var(--accent-100))",
          200: "rgb(var(--accent-200))",
          300: "rgb(var(--accent-300))",
          400: "rgb(var(--accent-400))",
          500: "rgb(var(--accent-500))",
          600: "rgb(var(--accent-600))",
          700: "rgb(var(--accent-700))",
          800: "rgb(var(--accent-800))",
          900: "rgb(var(--accent-900))",
          950: "rgb(var(--accent-950))",
        },
        danger: {
          DEFAULT: "hsl(var(--danger))",
          foreground: "hsl(var(--danger-foreground))",
          25: "rgb(var(--danger-25))",
          50: "rgb(var(--danger-50))",
          100: "rgb(var(--danger-100))",
          200: "rgb(var(--danger-200))",
          300: "rgb(var(--danger-300))",
          400: "rgb(var(--danger-400))",
          500: "rgb(var(--danger-500))",
          600: "rgb(var(--danger-600))",
          700: "rgb(var(--danger-700))",
          800: "rgb(var(--danger-800))",
          900: "rgb(var(--danger-900))",
          950: "rgb(var(--danger-950))",
        },
        warning: {
          25: "rgb(var(--warning-25))",
          50: "rgb(var(--warning-50))",
          100: "rgb(var(--warning-100))",
          200: "rgb(var(--warning-200))",
          300: "rgb(var(--warning-300))",
          400: "rgb(var(--warning-400))",
          500: "rgb(var(--warning-500))",
          600: "rgb(var(--warning-600))",
          700: "rgb(var(--warning-700))",
          800: "rgb(var(--warning-800))",
          900: "rgb(var(--warning-900))",
          950: "rgb(var(--warning-950))",
        },
        success: {
          25: "rgb(var(--success-25))",
          50: "rgb(var(--success-50))",
          100: "rgb(var(--success-100))",
          200: "rgb(var(--success-200))",
          300: "rgb(var(--success-300))",
          400: "rgb(var(--success-400))",
          500: "rgb(var(--success-500))",
          600: "rgb(var(--success-600))",
          700: "rgb(var(--success-700))",
          800: "rgb(var(--success-800))",
          900: "rgb(var(--success-900))",
          950: "rgb(var(--success-950))",
        },
        info: {
          25: "rgb(var(--info-25))",
          50: "rgb(var(--info-50))",
          100: "rgb(var(--info-100))",
          200: "rgb(var(--info-200))",
          300: "rgb(var(--info-300))",
          400: "rgb(var(--info-400))",
          500: "rgb(var(--info-500))",
          600: "rgb(var(--info-600))",
          700: "rgb(var(--info-700))",
          800: "rgb(var(--info-800))",
          900: "rgb(var(--info-900))",
          950: "rgb(var(--info-950))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
        surface: {
          0: "var(--surface-0)",
          1: "var(--surface-1)",
          2: "var(--surface-2)",
        },
        text: {
          primary: "var(--text-primary)",
          secondary: "var(--text-secondary)",
          tertiary: "var(--text-tertiary)",
          disabled: "var(--text-disabled)",
        },
      },
      spacing: {
        'xxs': '0.25rem',
        'xs': '0.5rem',
        'sm': '0.75rem',
        'md': '1.25rem',
        'lg': '1.5rem',
        'xl': '2rem',
        '2xl': '2.5rem',
        '3xl': '3rem',
        '4xl': '4rem',
      },
      borderRadius: {
        'sm': '0.125rem',
        'base': '0.25rem',
        'md': '0.375rem',
        'lg': '0.5rem',
        'xl': '0.75rem',
        'pill': '9999px',
      },
      fontFamily: {
        sans: ['"Roboto Flex"', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', '"Helvetica Neue"', 'Arial', 'sans-serif'],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "Monaco", "Consolas", "monospace"],
      },
      boxShadow: {
        sm: "0px 0.7px 0.6px hsl(0deg 0% 67% / 0.49), 0px 0.9px 0.7px -2.2px hsl(0deg 0% 67% / 0.35), 0px 2.3px 1.9px -4.5px hsl(0deg 0% 67% / 0.2)",
        DEFAULT: "0px 0.7px 0.6px hsl(0deg 0% 67% / 0.41), 0px 1px 0.8px -1.1px hsl(0deg 0% 67% / 0.34), 0px 2.2px 1.8px -2.2px hsl(0deg 0% 67% / 0.27), 0px 5.5px 4.5px -3.4px hsl(0deg 0% 67% / 0.19), 0px 11.7px 9.7px -4.5px hsl(0deg 0% 67% / 0.12)",
        md: "0px 0.7px 0.6px hsl(0deg 0% 67% / 0.38), 0px 1.1px 0.9px -0.5px hsl(0deg 0% 67% / 0.35), 0px 1.9px 1.6px -1px hsl(0deg 0% 67% / 0.32), 0px 3.4px 2.8px -1.5px hsl(0deg 0% 67% / 0.28), 0px 6.1px 5px -2px hsl(0deg 0% 67% / 0.25), 0px 10.4px 8.6px -2.5px hsl(0deg 0% 67% / 0.21), 0px 16.7px 13.8px -3px hsl(0deg 0% 67% / 0.18)",
        lg: "rgba(50, 50, 93, 0.25) 0px 30px 60px -12px, rgba(0, 0, 0, 0.3) 0px 18px 36px -18px",
        "2xl": "rgba(255, 255, 255, 0.1) 0px 1px 1px 0px inset, rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px",
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "fade-out": {
          from: { opacity: "1" },
          to: { opacity: "0" },
        },
        "slide-in-from-top": {
          from: { transform: "translateY(-100%)" },
          to: { transform: "translateY(0)" },
        },
        "slide-in-from-right": {
          from: { transform: "translateX(100%)" },
          to: { transform: "translateX(0)" },
        },
        "slide-in-from-bottom": {
          from: { transform: "translateY(100%)" },
          to: { transform: "translateY(0)" },
        },
        "slide-in-from-left": {
          from: { transform: "translateX(-100%)" },
          to: { transform: "translateX(0)" },
        },
        "slide-out-to-top": {
          from: { transform: "translateY(0)" },
          to: { transform: "translateY(-100%)" },
        },
        "slide-out-to-right": {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(100%)" },
        },
        "slide-out-to-bottom": {
          from: { transform: "translateY(0)" },
          to: { transform: "translateY(100%)" },
        },
        "slide-out-to-left": {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-100%)" },
        },
        "zoom-in": {
          from: { opacity: "0", transform: "scale(0.95)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        "zoom-out": {
          from: { opacity: "1", transform: "scale(1)" },
          to: { opacity: "0", transform: "scale(0.95)" },
        },
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "collapsible-down": {
          from: { height: "0" },
          to: { height: "var(--radix-collapsible-content-height)" },
        },
        "collapsible-up": {
          from: { height: "var(--radix-collapsible-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.25s ease-in-out",
        "fade-out": "fade-out 0.25s ease-in-out",
        "slide-in-from-top": "slide-in-from-top 0.25s ease-in-out",
        "slide-in-from-right": "slide-in-from-right 0.25s ease-in-out",
        "slide-in-from-bottom": "slide-in-from-bottom 0.25s ease-in-out",
        "slide-in-from-left": "slide-in-from-left 0.25s ease-in-out",
        "slide-out-to-top": "slide-out-to-top 0.25s ease-in-out",
        "slide-out-to-right": "slide-out-to-right 0.25s ease-in-out",
        "slide-out-to-bottom": "slide-out-to-bottom 0.25s ease-in-out",
        "slide-out-to-left": "slide-out-to-left 0.25s ease-in-out",
        "zoom-in": "zoom-in 0.25s ease-in-out",
        "zoom-out": "zoom-out 0.25s ease-in-out",
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "collapsible-down": "collapsible-down 0.2s ease-out",
        "collapsible-up": "collapsible-up 0.2s ease-out",
      },
      textStyles: {
        // Display styles
        'display-1': ({ theme }: ThemeUtil) => ({
          fontSize: theme('fontSize.4xl[0]'),
          lineHeight: theme('fontSize.4xl[1].lineHeight'),
          fontWeight: theme('fontWeight.bold'),
          letterSpacing: theme('letterSpacing.tight'),
          color: 'rgb(var(--neutral-800))',
          '.dark &': {
            color: 'rgb(var(--neutral-50))'
          },
        }),
        'display-2': ({ theme }: ThemeUtil) => ({
          fontSize: theme('fontSize.3xl[0]'),
          lineHeight: theme('fontSize.3xl[1].lineHeight'),
          fontWeight: theme('fontWeight.bold'),
          letterSpacing: theme('letterSpacing.tight'),
          color: 'rgb(var(--neutral-800))',
          '.dark &': {
            color: 'rgb(var(--neutral-50))'
          },
        }),
        'heading-1': ({ theme }: ThemeUtil) => ({
          fontSize: theme('fontSize.2xl[0]'),
          lineHeight: theme('fontSize.2xl[1].lineHeight'),
          fontWeight: theme('fontWeight.semibold'),
          letterSpacing: theme('letterSpacing.tight'),
          color: 'rgb(var(--neutral-800))',
          '.dark &': {
            color: 'rgb(var(--neutral-50))'
          },
        }),
        'heading-2': ({ theme }: ThemeUtil) => ({
          fontSize: theme('fontSize.xl[0]'),
          lineHeight: theme('fontSize.xl[1].lineHeight'),
          fontWeight: theme('fontWeight.semibold'),
          letterSpacing: theme('letterSpacing.tight'),
          color: 'rgb(var(--neutral-800))',
          '.dark &': {
            color: 'rgb(var(--neutral-50))'
          },
        }),
        'heading-3': ({ theme }: ThemeUtil) => ({
          fontSize: theme('fontSize.lg[0]'),
          lineHeight: theme('fontSize.lg[1].lineHeight'),
          fontWeight: theme('fontWeight.semibold'),
          letterSpacing: theme('letterSpacing.tight'),
          color: 'rgb(var(--neutral-800))',
          '.dark &': {
            color: 'rgb(var(--neutral-50))'
          },
        }),
        'heading-4': ({ theme }: ThemeUtil) => ({
          fontSize: theme('fontSize.base[0]'),
          lineHeight: theme('fontSize.base[1].lineHeight'),
          fontWeight: theme('fontWeight.semibold'),
          letterSpacing: theme('letterSpacing.normal'),
          color: 'rgb(var(--neutral-800))',
          '.dark &': {
            color: 'rgb(var(--neutral-50))'
          },
        }),
        'heading-5': ({ theme }: ThemeUtil) => ({
          fontSize: theme('fontSize.sm[0]'),
          lineHeight: theme('fontSize.sm[1].lineHeight'),
          fontWeight: theme('fontWeight.semibold'),
          letterSpacing: theme('letterSpacing.normal'),
          color: 'rgb(var(--neutral-800))',
          '.dark &': {
            color: 'rgb(var(--neutral-50))'
          },
        }),
        'p': ({ theme }: ThemeUtil) => ({
          fontSize: theme('fontSize.base[0]'),
          lineHeight: theme('fontSize.base[1].lineHeight'),
          fontWeight: theme('fontWeight.normal'),
          letterSpacing: theme('letterSpacing.normal'),
          color: 'rgb(var(--neutral-600))',
          '.dark &': {
            color: 'rgb(var(--neutral-50))'
          },
        }),
        'p-small': ({ theme }: ThemeUtil) => ({
          fontSize: theme('fontSize.sm[0]'),
          lineHeight: theme('lineHeight.tight'),
          fontWeight: theme('fontWeight.normal'),
          letterSpacing: theme('letterSpacing.normal'),
          color: 'rgb(var(--neutral-600))',
          '.dark &': {
            color: 'rgb(var(--neutral-50))'
          },
        }),
        'link': ({ theme }: ThemeUtil) => ({
          textDecorationLine: 'underline',
          textUnderlineOffset: '0.2em',
          fontWeight: theme('fontWeight.medium'),
          transition: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',
          color: 'rgb(var(--primary-600))',
          '.dark &': {
            color: 'rgb(var(--primary-400))'
          },
        }),
        'code': ({ theme }: ThemeUtil) => ({
          fontFamily: theme('fontFamily.mono'),
          fontSize: theme('fontSize.sm[0]'),
          lineHeight: theme('fontSize.sm[1].lineHeight'),
          padding: '0.2em 0.4em',
          borderRadius: theme('borderRadius.sm'),
          backgroundColor: 'rgb(var(--neutral-100))',
          color: 'rgb(var(--neutral-900))',
          '.dark &': {
            backgroundColor: 'rgb(var(--neutral-800))',
            color: 'rgb(var(--neutral-100))'
          },
        }),
        'label': ({ theme }: ThemeUtil) => ({
          fontSize: theme('fontSize.sm[0]'),
          lineHeight: theme('fontSize.sm[1].lineHeight'),
          fontWeight: theme('fontWeight.medium'),
          letterSpacing: theme('letterSpacing.wide'),
          color: 'rgb(var(--neutral-700))',
          '.dark &': {
            color: 'rgb(var(--neutral-300))'
          },
        }),
        'caption': ({ theme }: ThemeUtil) => ({
          fontSize: theme('fontSize.xs[0]'),
          lineHeight: theme('fontSize.xs[1].lineHeight'),
          color: 'rgb(var(--neutral-600))',
          '.dark &': {
            color: 'rgb(var(--neutral-400))'
          },
        }),
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    require('tailwind-scrollbar'),
    // Animation utilities plugin
    plugin(({ addUtilities }) => {
      addUtilities({
        '.animate-in': {
          'animation-duration': 'var(--duration-normal)',
          'animation-timing-function': 'var(--ease-out)',
          'animation-fill-mode': 'forwards',
        },
        '.animate-out': {
          'animation-duration': 'var(--duration-normal)',
          'animation-timing-function': 'var(--ease-in)',
          'animation-fill-mode': 'forwards',
        },
        '[data-state="open"] .animate-in, .data-[state=open]:animate-in': {
          'animation-name': 'enter',
        },
        '[data-state="closed"] .animate-out, .data-[state=closed]:animate-out': {
          'animation-name': 'exit',
        },
      });
    }),
    // Accessibility - Reduced Motion plugin
    plugin(({ addUtilities }) => {
      addUtilities({
        '@media (prefers-reduced-motion: reduce)': {
          '.animate-in, .animate-out': {
            'animation': 'none !important',
          },
          '.transition-transform, .transition-opacity, .transition-all': {
            'transition': 'none !important',
          },
        },
      });
    }),
    // Text styles plugin
    plugin(({ addComponents, theme }) => {
      const styles = Object.entries(theme('textStyles') as Record<string, any>).reduce((acc, [key, value]) => {
        acc[`.text-${key}`] = typeof value === 'function' ? value({ theme }) : value;
        return acc;
      }, {} as Record<string, any>);
      addComponents(styles);
    }),
  ],
};

export default config;