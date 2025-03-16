import { useTheme } from "next-themes";

export interface ChartColorOptions {
  variant?: "primary" | "sequential" | "categorical" | "divergent";
  opacity?: number;
  useGradient?: boolean;
  colorCount?: number;
}

export function useChartStyles(options: ChartColorOptions = {}) {
  const {
    variant = "primary",
    opacity = 0.8,
    useGradient = true,
    colorCount = 8,
  } = options;

  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Safely access CSS variables with fallbacks
  const getCSSVariable = (name: string, fallback: string): string => {
    if (typeof window !== "undefined") {
      const value = getComputedStyle(document.documentElement).getPropertyValue(
        name
      );
      return value ? value.trim() : fallback;
    }
    return fallback;
  };

  // Chart colors from theme CSS variables or fallbacks
  const chartColors = {
    deepOcean: getCSSVariable("--chart-deep-ocean", "hsl(200 95% 19%)"),
    midnightSky: getCSSVariable("--chart-midnight-sky", "hsl(217 44% 33%)"),
    stormyViolet: getCSSVariable("--chart-stormy-violet", "hsl(261 16% 36%)"),
    wildBerry: getCSSVariable("--chart-wild-berry", "hsl(312 33% 47%)"),
    rosewood: getCSSVariable("--chart-rosewood", "hsl(327 54% 56%)"),
    sunsetBlush: getCSSVariable("--chart-sunset-blush", "hsl(350 86% 67%)"),
    autumnLeaf: getCSSVariable("--chart-autumn-leaf", "hsl(19 100% 64%)"),
    goldenSun: getCSSVariable("--chart-golden-sun", "hsl(39 100% 53%)"),
  };

  // Returns an array of n colors based on the variant
  const getColorPalette = (count: number = colorCount) => {
    const allColors = [
      chartColors.deepOcean,
      chartColors.midnightSky,
      chartColors.stormyViolet,
      chartColors.wildBerry,
      chartColors.rosewood,
      chartColors.sunsetBlush,
      chartColors.autumnLeaf,
      chartColors.goldenSun,
    ];

    if (variant === "sequential") {
      // Return a subset based on count (bluish to yellowish)
      return allColors.slice(0, count);
    } else if (variant === "categorical") {
      // Return evenly distributed colors
      return Array.from(
        { length: count },
        (_, i) => allColors[Math.floor((i * allColors.length) / count)]
      );
    } else if (variant === "divergent") {
      // Blue to red spectrum
      return [
        chartColors.deepOcean,
        chartColors.midnightSky,
        chartColors.stormyViolet,
        chartColors.wildBerry,
        chartColors.rosewood,
      ].slice(0, count);
    }

    // Default primary
    return allColors.slice(0, count);
  };

  // Generate radar/polar chart gradient fills
  const getRadarGradients = (colors = getColorPalette()) => {
    return colors.map((color, index) => ({
      id: `radar-gradient-${index}`,
      color,
      fill: `url(#radar-gradient-${index})`,
      stroke: color,
    }));
  };

  // Legend hover effect handler
  const getLegendEffectOpacity = () => {
    return {
      onMouseEnter: (o: any, index: number, e: React.MouseEvent) => {
        const container =
          e.currentTarget.parentElement?.parentElement?.parentElement;
        if (!container) return;

        // Find all the series layers (areas, lines, bars, etc.)
        const seriesElements = container.querySelectorAll(
          ".recharts-layer.recharts-area, .recharts-layer.recharts-line, .recharts-layer.recharts-bar, .recharts-layer.recharts-radar"
        );

        // Reduce opacity for all series except the selected one
        seriesElements.forEach((element, i) => {
          if (i !== index) {
            (element as HTMLElement).style.opacity = "0.25";
          } else {
            (element as HTMLElement).style.opacity = "1";
          }
        });
      },
      onMouseLeave: (o: any, index: number, e: React.MouseEvent) => {
        const container =
          e.currentTarget.parentElement?.parentElement?.parentElement;
        if (!container) return;

        // Reset all series to full opacity
        const seriesElements = container.querySelectorAll(
          ".recharts-layer.recharts-area, .recharts-layer.recharts-line, .recharts-layer.recharts-bar, .recharts-layer.recharts-radar"
        );
        seriesElements.forEach((element) => {
          (element as HTMLElement).style.opacity = "1";
        });
      },
    };
  };

  // Apple-like styling defaults for chart components
  const chartDefaults = {
    // Use CSS variable or fallback
    stroke: getCSSVariable("--chart-grid", "#e5e5ea"),
    fillOpacity: 0.3,
    strokeWidth: 2,
    labelFontSize: 12,
    labelColor: getCSSVariable("--chart-label", "#1D1D1F"),
    tickColor: getCSSVariable("--chart-tick", "#8E8E93"),
    axisColor: getCSSVariable("--chart-axis", "#d1d1d6"),
    tooltipStyle: {
      contentStyle: {
        borderRadius: "8px",
        backgroundColor: isDark
          ? "rgba(40, 40, 45, 0.95)"
          : "rgba(255, 255, 255, 0.95)",
        border: isDark ? "1px solid #3a3a3c" : "1px solid #f1f1f1",
        boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
        padding: "8px 12px",
        color: isDark ? "#f5f5f7" : undefined,
      },
      itemStyle: {
        fontSize: "12px",
        color: isDark ? "#f5f5f7" : undefined,
      },
      labelStyle: {
        fontSize: "12px",
        fontWeight: "bold",
        color: isDark ? "#f5f5f7" : undefined,
      },
    },
  };

  return {
    chartColors,
    getColorPalette,
    getRadarGradients,
    getLegendEffectOpacity,
    chartDefaults,
    isDark,
  };
}