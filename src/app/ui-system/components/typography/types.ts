export interface TypographyToken {
    name: string;
    variable: string;
    value: string;
    category: string;
    description?: string;
    hasError?: boolean;
  }
  
  export interface TypographyCategory {
    name: string;
    tokens: TypographyToken[];
  }
  
  export interface FontsPayload {
    colorTokens: any[];
    typographyTokens: TypographyToken[];
    spacingTokens: any[];
    shadowTokens: any[];
  }
  
  // Define typography categories
  export const TYPOGRAPHY_CATEGORIES = [
    "fontFamily",
    "fontSize",
    "fontWeight",
    "lineHeight",
    "letterSpacing",
    "maxWidth"
  ];
  
  // Define font sizes
  export const FONT_SIZES = [
    "2xs", "xs", "sm", "base", "lg", "xl", "2xl", "3xl", "4xl", "5xl", "6xl"
  ];
  
  // Define font weights
  export const FONT_WEIGHTS = [
    "thin", "light", "normal", "medium", "semibold", "bold", "black"
  ];
  
  // Define line heights
  export const LINE_HEIGHTS = [
    "none", "tight", "snug", "normal", "relaxed", "loose"
  ];
  
  // Define letter spacing
  export const LETTER_SPACING = [
    "tighter", "tight", "normal", "wide", "wider", "widest"
  ];
  
  // Define max widths
  export const MAX_WIDTHS = [
    "copy-xxs", "copy-xs", "copy-sm", "copy-base", "copy-lg", "copy-xl"
  ];