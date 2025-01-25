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
        // Base colors
        body: "var(--background-page)",
        input: "var(--background-input)",
        disabled: "var(--background-disabled)",
        surface: {
          DEFAULT: "var(--background-surface)",
          raised: "var(--background-surface-raised)",
          elevated: "var(--background-surface-elevated)",
          sunken: "var(--background-surface-sunken)",
          hollowed: "var(--background-surface-hollowed)",
        },

        // Text colors
        text: {
          strongest: "var(--text-strongest)",
          strong: "var(--text-strong)",
          DEFAULT: "var(--text-base)",
          weak: "var(--text-weak)",
          weakest: "var(--text-weakest)",
          muted: "var(--text-muted)",
          disabled: "var(--text-disabled)",
          inverse: "var(--text-inverse)",
        },

        // Interactive colors
        neutral: {
          DEFAULT: "var(--background-neutral-weakest)",
          weakest: "var(--background-neutral-weakest)",
          weaker: "var(--background-neutral-weaker)",
          weak: "var(--background-neutral-weak)",
          strong: "var(--background-neutral-strong)",
          stronger: "var(--background-neutral-stronger)",
          strongest: "var(--background-neutral-strongest)",
          text: "var(--text-neutral)",
        },
        primary: {
          DEFAULT: "var(--background-primary)",
          weakest: "var(--background-primary-weakest)",
          weaker: "var(--background-primary-weaker)",
          weak: "var(--background-primary-weak)",
          strong: "var(--background-primary-strong)",
          stronger: "var(--background-primary-stronger)",
          strongest: "var(--background-primary-strongest)",
          text: "var(--text-primary)",
        },
        warning: {
          DEFAULT: "var(--background-warning)",
          weakest: "var(--background-warning-weakest)",
          weaker: "var(--background-warning-weaker)",
          weak: "var(--background-warning-weak)",
          strong: "var(--background-warning-strong)",
          stronger: "var(--background-warning-stronger)",
          strongest: "var(--background-warning-strongest)",
          text: "var(--text-warning)",
        },
        danger: {
          DEFAULT: "var(--background-danger)",
          weakest: "var(--background-danger-weakest)",
          weaker: "var(--background-danger-weaker)",
          weak: "var(--background-danger-weak)",
          strong: "var(--background-danger-strong)",
          stronger: "var(--background-danger-stronger)",
          strongest: "var(--background-danger-strongest)",
          text: "var(--text-danger)",
        },
        success: {
          DEFAULT: "var(--background-success)",
          weakest: "var(--background-success-weakest)",
          weaker: "var(--background-success-weaker)",
          weak: "var(--background-success-weak)",
          strong: "var(--background-success-strong)",
          stronger: "var(--background-success-stronger)",
          strongest: "var(--background-success-strongest)",
          text: "var(--text-success)",
        },
        accent: {
          DEFAULT: "var(--background-accent)",
          weakest: "var(--background-accent-weakest)",
          weaker: "var(--background-accent-weaker)",
          weak: "var(--background-accent-weak)",
          strong: "var(--background-accent-strong)",
          stronger: "var(--background-accent-stronger)",
          strongest: "var(--background-accent-strongest)",
          text: "var(--text-accent)",
        },
        info: {
          DEFAULT: "var(--background-info)",
          weakest: "var(--background-info-weakest)",
          weaker: "var(--background-info-weaker)",
          weak: "var(--background-info-weak)",
          strong: "var(--background-info-strong)",
          stronger: "var(--background-info-stronger)",
          strongest: "var(--background-info-strongest)",
          text: "var(--text-info)",
        },

        // Border colors
        border: {
          DEFAULT: "var(--border-default)",
          strong: "var(--border-strong)",
          strongest: "var(--border-strongest)",
          weak: "var(--border-weak)",
          weakest: "var(--border-weakest)",

          primary: "var(--border-primary)",
          primaryHover: "var(--border-primary-hover)",
          warning: "var(--border-warning)",
          warningHover: "var(--border-warning-hover)",
          danger: "var(--border-danger)",
          dangerHover: "var(--border-danger-hover)",
          success: "var(--border-success)",
          successHover: "var(--border-success-hover)",
          accent: "var(--border-accent)",
          accentHover: "var(--border-accent-hover)",
          info: "var(--border-info)",
          infoHover: "var(--border-info-hover)",
        },
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

    // Typography styles plugin
    plugin(({ addComponents }) => {
      const styles = {
        // Display styles
        ".text-display-1": {
          fontFamily: "var(--font-family-sans)",
          fontSize: "var(--font-size-4xl)",
          lineHeight: "var(--line-height-tight)",
          fontWeight: "var(--font-weight-bold)",
          letterSpacing: "var(--letter-spacing-tight)",
        },
        ".text-display-2": {
          fontFamily: "var(--font-family-sans)",
          fontSize: "var(--font-size-3xl)",
          lineHeight: "var(--line-height-tight)",
          fontWeight: "var(--font-weight-bold)",
          letterSpacing: "var(--letter-spacing-tight)",
        },

        // Heading styles
        ".text-heading-1": {
          fontFamily: "var(--font-family-sans)",
          fontSize: "var(--font-size-2xl)",
          lineHeight: "var(--line-height-tight)",
          fontWeight: "var(--font-weight-semibold)",
          letterSpacing: "var(--letter-spacing-tight)",
        },
        ".text-heading-2": {
          fontFamily: "var(--font-family-sans)",
          fontSize: "var(--font-size-xl)",
          lineHeight: "var(--line-height-snug)",
          fontWeight: "var(--font-weight-semibold)",
          letterSpacing: "var(--letter-spacing-tight)",
        },
        ".text-heading-3": {
          fontFamily: "var(--font-family-sans)",
          fontSize: "var(--font-size-lg)",
          lineHeight: "var(--line-height-normal)",
          fontWeight: "var(--font-weight-semibold)",
          letterSpacing: "var(--letter-spacing-tight)",
        },
        ".text-heading-4": {
          fontFamily: "var(--font-family-sans)",
          fontSize: "var(--font-size-base)",
          lineHeight: "var(--line-height-normal)",
          fontWeight: "var(--font-weight-semibold)",
          letterSpacing: "var(--letter-spacing-normal)",
        },
        ".text-heading-5": {
          fontFamily: "var(--font-family-sans)",
          fontSize: "var(--font-size-sm)",
          lineHeight: "var(--line-height-normal)",
          fontWeight: "var(--font-weight-semibold)",
          letterSpacing: "var(--letter-spacing-normal)",
        },
        ".text-heading-6": {
          fontFamily: "var(--font-family-sans)",
          fontSize: "var(--font-size-xs)",
          lineHeight: "var(--line-height-none)",
          fontWeight: "var(--font-weight-medium)",
          letterSpacing: "var(--letter-spacing-normal)",
        },

        // Body styles
        ".text-body-large": {
          fontFamily: "var(--font-family-sans)",
          fontSize: "var(--font-size-lg)",
          lineHeight: "var(--line-height-normal)",
          fontWeight: "var(--font-weight-normal)",
          letterSpacing: "var(--letter-spacing-normal)",
        },
        ".text-body": {
          fontFamily: "var(--font-family-sans)",
          fontSize: "var(--font-size-base)",
          lineHeight: "var(--line-height-normal)",
          fontWeight: "var(--font-weight-normal)",
          letterSpacing: "var(--letter-spacing-normal)",
        },
        ".text-body-small": {
          fontFamily: "var(--font-family-sans)",
          fontSize: "var(--font-size-sm)",
          lineHeight: "var(--line-height-tight)",
          fontWeight: "var(--font-weight-normal)",
          letterSpacing: "var(--letter-spacing-normal)",
        },

        // UI Element styles
        ".text-label": {
          fontFamily: "var(--font-family-sans)",
          fontSize: "var(--font-size-sm)",
          lineHeight: "var(--line-height-normal)",
          fontWeight: "var(--font-weight-medium)",
          letterSpacing: "var(--letter-spacing-wide)",
        },
        ".text-caption": {
          fontFamily: "var(--font-family-sans)",
          fontSize: "var(--font-size-xs)",
          lineHeight: "var(--line-height-normal)",
          fontWeight: "var(--font-weight-normal)",
          letterSpacing: "var(--letter-spacing-normal)",
        },
        ".text-overline": {
          fontFamily: "var(--font-family-sans)",
          fontSize: "var(--font-size-xs)",
          lineHeight: "var(--line-height-normal)",
          fontWeight: "var(--font-weight-medium)",
          letterSpacing: "var(--letter-spacing-wider)",
          textTransform: "uppercase",
        },
        ".text-code": {
          fontFamily: "var(--font-family-mono)",
          fontSize: "var(--font-size-sm)",
          lineHeight: "var(--line-height-normal)",
          fontWeight: "var(--font-weight-normal)",
          letterSpacing: "var(--letter-spacing-normal)",
        },

        // Interactive styles
        ".text-link": {
          textDecorationLine: "underline",
          textUnderlineOffset: "0.2em",
          fontWeight: "var(--font-weight-medium)",
          transition: "all 150ms var(--ease-in-out)",
        },
        ".text-button": {
          fontFamily: "var(--font-family-sans)",
          fontSize: "var(--font-size-sm)",
          lineHeight: "var(--line-height-normal)",
          fontWeight: "var(--font-weight-medium)",
          letterSpacing: "var(--letter-spacing-wide)",
        },

        // Shared Form styles
        ".form-basics": {
          backgroundColor: "var(--background-input)",
          color: "var(--text-base)",
          borderColor: "var(--border-default)",
          borderWidth: "1px",
          borderStyle: "solid",
          borderRadius: "var(--radius-base)",
          transitionProperty: "all",
          transitionTimingFunction: "var(--ease-out)",
          transitionDuration: "var(--duration-normal)",
          "&:hover": {
            borderColor: "var(--border-strongest)",
          },
          "&:focus": {
            borderColor: "var(--border-primary-hover)",
            outline: "none",
            ringWidth: "2px",
            ringOffsetWidth: "2px",
            ringColor: "var(--ring-primary)",
            ringOffsetColor: "var(--background-surface)",
          },
          "&:disabled": {
            cursor: "not-allowed",
            opacity: "var(--disabled-opacity)",
            backgroundColor: "var(--background-disabled)",
          },
        },
        ".form-element-shared": {
          position: "relative",
          width: "100%",
          display: "flex",
          alignItems: "center",
          cursor: "pointer",
        },

        ".form-element-sm": {
          height: "var(--space-xl)", // 32px
          fontSize: "var(--font-size-sm)",
          padding: "0 var(--space-sm)",
        },

        ".form-element-base": {
          height: "var(--space-2xl)", // 40px
          fontSize: "var(--font-size-base)",
          padding: "0 var(--space-sm)",
        },

        ".form-element-lg": {
          height: "var(--space-3xl)", // 48px
          fontSize: "var(--font-size-lg)",
          padding: "0 var(--space-sm)",
        },

        ".form-element-error": {
          borderColor: "var(--border-danger)",
          "&:hover": {
            borderColor: "var(--border-danger-hover)",
          },
          "&:focus": {
            borderColor: "var(--border-danger-hover)",
            ringColor: "var(--ring-danger)",
          },
        },

        ".form-layout-icon": {
          position: "absolute",
          display: "flex",
          alignItems: "center",
          height: "100%",
          pointerEvents: "none",
          color: "var(--text-weakest)",
          zIndex: "1",
          "&[data-size=sm]": {
            left: "var(--space-xs)",
          },
          "&[data-size=base]": {
            left: "var(--space-sm)",
          },
          "&[data-size=lg]": {
            left: "var(--space-base)",
          },
          "&[data-error=true]": {
            color: "var(--text-danger)",
          },
          "&[data-disabled=true]": {
            opacity: "var(--disabled-opacity)",
          },
          "& svg": {
            "&[data-size=sm]": {
              width: "var(--space-sm)",
              height: "var(--space-sm)",
            },
            "&[data-size=base]": {
              width: "var(--space-base)",
              height: "var(--space-base)",
            },
            "&[data-size=lg]": {
              width: "var(--space-md)",
              height: "var(--space-md)",
            },
          },
        },

        // Form Layout styles
        ".form-layout": {
          display: "flex",
          flexDirection: "column",
          width: "100%",
        },

        ".form-layout-label": {
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-xxs)",
        },

        ".form-layout-field": {
          position: "relative",
          width: "100%",
        },

        ".form-layout-helper": {
          marginTop: "var(--space-xs)",
          fontSize: "var(--font-size-sm)",
          color: "var(--text-weakest)",
          "&[data-error=true]": {
            color: "var(--text-danger)",
          },
        },

        // Modals styles
        ".overlay-basics": {
          position: "fixed",
          inset: "0",
          backgroundColor: "rgb(var(--color-neutral-300) / 0.5)",
          backdropFilter: "blur(var(--overlay-blur))",
          zIndex: "var(--z-modal)",
        },
        ".dialog-basics": {
          position: "fixed",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          width: "100%",
          display: "grid",
          gap: "var(--space-md)",
          backgroundColor: "var(--background-surface)",
          borderWidth: "1px",
          borderStyle: "solid",
          borderRadius: "var(--radius-lg)",
          boxShadow: "var(--shadow-md)",
          padding: "var(--space-lg)",
          transitionProperty: "all",
          transitionDuration: "var(--duration-normal)",
          transitionTimingFunction: "var(--ease-out)",
          zIndex: "var(--z-modal)",
        },

        // pop styles (calendar, command, dropdownmenu. ...)
        ".popcard-basics": {
          overflow: "hidden",
          borderRadius: "var(--radius-base)",
          borderWidth: "1px",
          borderStyle: "solid",
          borderColor: "var(--border-default)",
          backgroundColor: "var(--background-surface-raised)",
          color: "var(--text-base)",
          padding: "var(--space-xxs)",
          boxShadow: "var(--shadow-base)",
          zIndex: "var(--z-dropdown)",
          animationDuration: "var(--duration-normal)",
          animationTimingFunction: "var(--ease-out)",
        },

        // menu list inside components with popcard: Command, DropdownMenu, MenuBar)
        ".popcard-list-group": {
          overflow: "hidden",
          // padding: "var(--space-xxs)",
          color: "var(--text-base)",
        },
        ".popcard-list-group-title": {
          fontSize: "var(--font-size-xs)",
          fontWeight: "var(--font-weight-medium)",
          padding: "var(--space-xs)",
          paddingTop: "var(--space-xxs)",
          color: "var(--text-muted)",
        },
        ".popcard-list-separator": {
          marginLeft: "-0.25rem",
          marginRight: "-0.25rem",
          marginTop: "var(--space-xxs)",
          marginBottom: "var(--space-xxs)",
          height: "1px",
          backgroundColor: "var(--border-weak)",
        },
        ".popcard-list-item": {
          position: "relative",
          display: "flex",
          cursor: "default",
          userSelect: "none",
          alignItems: "center",
          gap: "var(--space-sm)",
          borderRadius: "var(--radius-sm)",
          padding: "0.375rem 0.5rem",
          outline: "none",
          color: "var(--text-weak)",
          fontSize: "var(--font-size-sm)",
          lineHeight: "var(--line-height-tight)",
          "&[data-disabled=true]": {
            pointerEvents: "none",
            opacity: "var(--disabled-opacity)",
          },
          "&[data-selected=true]": {
            backgroundColor: "var(--background-surface-sunken)",
            color: "var(--text-primary-strongest)",
          },
          // ":focus, :hover": {
          //   backgroundColor: "var(--background-surface-sunken)",
          // },
        },
        ".popcard-list-shortcut": {
          marginLeft: "auto",
          fontSize: "var(--font-size-xs)",
          letterSpacing: "var(--letter-spacing-widest)",
          color: "var(--text-muted)",
        },
        ".popcard-list-indicator": {
          position: "absolute",
          left: "0.5rem",
          display: "flex",
          height: "0.875rem",
          width: "0.875rem",
          alignItems: "center",
          justifyContent: "center",
        },
        ".popcard-checkbox-item, .popcard-radio-item": {
          position: "relative",
          paddingLeft: "var(--space-xl)",
          // ":focus, :hover": {
          //   backgroundColor: "var(--background-surface-sunken)",
          // },
        },
        ".popcard-item-destructive": {
          color: "var(--text-danger)",
          ":hover": {
            backgroundColor: "var(--background-danger-weakest)",
          },
        },

        // Icons
        svg: {
          width: "1rem",
          height: "1rem",
        },
        ".icon-chevron-right": {
          marginLeft: "auto",
          width: "1rem",
          color: "var(--text-weakest)",
        },
        ".icon-checked": {
          width: "1rem",
          height: "1rem",
          color: "var(--background-primary)",
        },
        ".icon-circle-selected": {
          width: "0.5rem",
          height: "0.5rem",
          color: "var(--background-primary)",
          fill: "var(--background-primary)",
        },
      };
      addComponents(styles);
    }),

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
