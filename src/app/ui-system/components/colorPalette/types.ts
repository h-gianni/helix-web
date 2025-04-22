export interface ColorToken {
    name: string;
    variable: string;
    value: string;
    category: string;
  }
  
  export interface ColorPalette {
    name: string;
    category: string;
    tokens: ColorToken[];
  }
  
  export interface TokenUpdatePayload {
    colorTokens: ColorToken[];
    spacingTokens: any[]; 
    typographyTokens: any[];
    shadowTokens: any[];
  }
  
  export const COLOR_CATEGORIES = [
    "primary",
    "neutral",
    "accent", 
    "info",
    "destructive",
    "warning",
    "success"
  ];
  
  export const SHADES = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];