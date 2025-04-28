import { ColorToken, SHADES } from "./types";

// Helper to parse HSL color
export const parseHsl = (hslString: string) => {
  // Handle different HSL formats
  const match = hslString.match(/hsl\((\d+)\s+(\d+)%\s+(\d+)%\)/);
  if (match) {
    return {
      h: parseInt(match[1]),
      s: parseInt(match[2]),
      l: parseInt(match[3]),
    };
  }
  return null;
};

// Helper to format HSL color
export const formatHsl = (h: number, s: number, l: number) => {
  return `hsl(${h} ${s}% ${l}%)`;
};

// Helper to convert HSL to Hex
export const hslToHex = (h: number, s: number, l: number) => {
  l /= 100;
  const a = (s * Math.min(l, 1 - l)) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
};

// Helper to convert color string to hex
export const colorToHex = (color: string) => {
  const hsl = parseHsl(color);
  if (hsl) {
    return hslToHex(hsl.h, hsl.s, hsl.l);
  }
  return "#ff0000"; // Default red if parsing fails
};

// Helper to convert hex to HSL
export const hexToHsl = (hex: string) => {
  // Remove # if present
  hex = hex.replace(/^#/, "");

  // Parse hex to RGB
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;

  // Calculate HSL
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0,
    s = 0,
    l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }

    h = Math.round(h * 60);
    s = Math.round(s * 100);
  }

  l = Math.round(l * 100);

  return { h, s, l };
};

// Initialize a color palette with default values
export const initializeColorPalette = (category: string): ColorToken[] => {
  const baseColor = getDefaultBaseColor(category);
  const { h, s } = parseHsl(baseColor) || { h: 0, s: 0 };

  const result = SHADES.map((shade) => {
    // Calculate the luminosity for each shade (higher shade = darker color)
    const l = calculateLuminosity(shade);

    return {
      name: `${category.charAt(0).toUpperCase() + category.slice(1)} ${shade}`,
      variable: `--${category}-${shade}`,
      value: formatHsl(h, s, l),
      category,
    };
  });

  console.log(`Initialized ${result.length} tokens for ${category}`);
  return result;
};

// Calculate luminosity based on shade number
const calculateLuminosity = (shade: number): number => {
  // Map shade numbers to appropriate luminosity values
  // 50 = lightest (94%), 950 = darkest (10%)
  const mapping: { [key: number]: number } = {
    50: 94,
    100: 86,
    200: 74,
    300: 66,
    400: 58,
    500: 50,
    600: 42,
    700: 34,
    800: 26,
    900: 18,
    950: 10,
  };

  return mapping[shade] || 50; // Default to 50% if shade not found
};

// Get default base color for each category
const getDefaultBaseColor = (category: string): string => {
  switch (category) {
    case "primary":
      return "hsl(10 100% 50%)";
    case "secondary":
      return "hsl(224 97% 50%)";
    case "tertiary":
      return "hsl(289 47% 50%)";
    case "neutral":
      return "hsl(36 4% 50%)";
    case "accent":
      return "hsl(72 100% 50%)";
    case "info":
      return "hsl(221 16% 50%)";
    case "destructive":
      return "hsl(0 80% 50%)";
    case "warning":
      return "hsl(42 90% 50%)";
    case "success":
      return "hsl(138 80% 50%)";
    default:
      return "hsl(0 0% 50%)";
  }
};

// Update all tokens in a palette based on the base color
export const updateColorPaletteTokens = (
  tokens: ColorToken[],
  newBaseColorValue: string
): ColorToken[] => {
  // Try to parse the new HSL color
  const parsedColor = parseHsl(newBaseColorValue);
  if (!parsedColor) return tokens;

  // Update all colors with the new hue and saturation, keeping luminosity
  return tokens.map((token) => {
    // Parse the current token color to get its luminosity
    const currentColor = parseHsl(token.value);
    if (!currentColor) return token; // Skip if invalid format

    // Keep the original luminosity, but use new hue and saturation
    return {
      ...token,
      value: formatHsl(parsedColor.h, parsedColor.s, currentColor.l),
    };
  });
};

// Load tokens from localStorage or initialize defaults
export const loadColorTokens = (): ColorToken[] => {
  const savedTokens = localStorage.getItem("token-editor-colors");
  if (savedTokens) {
    try {
      const parsedTokens = JSON.parse(savedTokens);
      if (Array.isArray(parsedTokens) && parsedTokens.length > 0) {
        console.log(
          "Loaded saved tokens from localStorage",
          parsedTokens.length
        );
        return parsedTokens;
      }
    } catch (error) {
      console.error("Error parsing saved tokens:", error);
    }
  }

  // If no saved tokens, initialize default color palettes
  console.log("Initializing default color palettes");
  let allTokens: ColorToken[] = [];

  // Initialize all color categories
  [
    "primary",
    "neutral",
    "accent",
    "info",
    "destructive",
    "warning",
    "success",
  ].forEach((category) => {
    const tokens = initializeColorPalette(category);
    allTokens = [...allTokens, ...tokens];
  });

  console.log("Generated tokens:", allTokens.length);
  return allTokens;
};
