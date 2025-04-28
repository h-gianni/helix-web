import { 
    TypographyToken, 
    FONT_SIZES, 
    FONT_WEIGHTS, 
    LINE_HEIGHTS, 
    LETTER_SPACING,
    MAX_WIDTHS
  } from './types';
  
  // Create font family tokens
  export const initializeFontFamilyTokens = (): TypographyToken[] => {
    return [
      {
        name: "Font Sans",
        variable: "--font-sans",
        value: '"DM Sans", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        category: "fontFamily",
        description: "Primary font for UI text"
      },
      {
        name: "Font Mono",
        variable: "--font-mono",
        value: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
        category: "fontFamily",
        description: "Monospace font for code and technical content"
      }
    ];
  };
  
  // Create font size tokens
  export const initializeFontSizeTokens = (): TypographyToken[] => {
    const fontSizeValues = {
      "2xs": "0.625rem",  // 10px
      "xs": "0.75rem",    // 12px
      "sm": "0.875rem",   // 14px
      "base": "1rem",     // 16px
      "lg": "1.125rem",   // 18px
      "xl": "1.25rem",    // 20px
      "2xl": "1.5rem",    // 24px
      "3xl": "1.875rem",  // 30px
      "4xl": "2.25rem",   // 36px
      "5xl": "3rem",      // 48px
      "6xl": "3.75rem"    // 60px
    };
  
    return FONT_SIZES.map(size => ({
      name: `Text ${size}`,
      variable: `--text-${size}`,
      value: fontSizeValues[size as keyof typeof fontSizeValues],
      category: "fontSize",
      description: `Font size for ${size} text`
    }));
  };
  
  // Create font weight tokens
  export const initializeFontWeightTokens = (): TypographyToken[] => {
    const fontWeightValues = {
      "thin": "200",
      "light": "300",
      "normal": "400",
      "medium": "500",
      "semibold": "600",
      "bold": "700",
      "black": "800"
    };
  
    return FONT_WEIGHTS.map(weight => ({
      name: `Weight ${weight}`,
      variable: `--font-weight-${weight}`,
      value: fontWeightValues[weight as keyof typeof fontWeightValues],
      category: "fontWeight",
      description: `Font weight for ${weight} text`
    }));
  };
  
  // Create line height tokens
  export const initializeLineHeightTokens = (): TypographyToken[] => {
    const lineHeightValues = {
      "none": "1",
      "tight": "1.25",
      "snug": "1.375",
      "normal": "1.5",
      "relaxed": "1.625",
      "loose": "2"
    };
  
    return LINE_HEIGHTS.map(lineHeight => ({
      name: `Leading ${lineHeight}`,
      variable: `--leading-${lineHeight}`,
      value: lineHeightValues[lineHeight as keyof typeof lineHeightValues],
      category: "lineHeight",
      description: `Line height for ${lineHeight} spacing`
    }));
  };
  
  // Create letter spacing tokens
  export const initializeLetterSpacingTokens = (): TypographyToken[] => {
    const letterSpacingValues = {
      "tighter": "-0.05em",
      "tight": "-0.022em",
      "normal": "0",
      "wide": "0.022em",
      "wider": "0.05em",
      "widest": "0.25em"
    };
  
    return LETTER_SPACING.map(spacing => ({
      name: `Tracking ${spacing}`,
      variable: `--tracking-${spacing}`,
      value: letterSpacingValues[spacing as keyof typeof letterSpacingValues],
      category: "letterSpacing",
      description: `Letter spacing for ${spacing} tracking`
    }));
  };
  
  // Create max width tokens
  export const initializeMaxWidthTokens = (): TypographyToken[] => {
    const maxWidthValues = {
      "copy-xxs": "30ch",
      "copy-xs": "40ch",
      "copy-sm": "50ch",
      "copy-base": "65ch",
      "copy-lg": "75ch",
      "copy-xl": "85ch"
    };
  
    return MAX_WIDTHS.map(width => ({
      name: `Max Width ${width}`,
      variable: `--max-width-${width}`,
      value: maxWidthValues[width as keyof typeof maxWidthValues],
      category: "maxWidth",
      description: `Maximum width for ${width} text blocks`
    }));
  };
  
  // Load all typography tokens
  export const loadTypographyTokens = (): TypographyToken[] => {
    // Try to load from localStorage first
    const savedTokens = localStorage.getItem('typography-editor-tokens');
    if (savedTokens) {
      try {
        const parsedTokens = JSON.parse(savedTokens);
        if (Array.isArray(parsedTokens) && parsedTokens.length > 0) {
          console.log('Loaded saved typography tokens from localStorage', parsedTokens.length);
          return parsedTokens;
        }
      } catch (error) {
        console.error('Error parsing saved typography tokens:', error);
      }
    }
    
    // Initialize default tokens
    console.log('Initializing default typography tokens');
    return [
      ...initializeFontFamilyTokens(),
      ...initializeFontSizeTokens(),
      ...initializeFontWeightTokens(),
      ...initializeLineHeightTokens(),
      ...initializeLetterSpacingTokens(),
      ...initializeMaxWidthTokens()
    ];
  };
  
  // Validate typography token value
  export const validateTypographyValue = (value: string, category: string): boolean => {
    switch (category) {
      case 'fontSize':
      case 'maxWidth':
        // Check for valid CSS size units
        return /^\d*\.?\d+(rem|em|px|vh|vw|%|ch)$/.test(value);
      case 'fontWeight':
        // Font weight should be a number between 100 and 900, or a keyword
        return /^(100|200|300|400|500|600|700|800|900|normal|bold|lighter|bolder)$/.test(value);
      case 'lineHeight':
        // Line height can be a unitless number or with units
        return /^[\d.]+$/.test(value) || /^\d*\.?\d+(rem|em|px|%)$/.test(value);
      case 'letterSpacing':
        // Letter spacing can be a number with units or "normal"
        return /^-?\d*\.?\d+(em|rem|px)$/.test(value) || value === "normal";
      case 'fontFamily':
        // Font family should be a comma-separated list of font names
        return value.trim().length > 0;
      default:
        return true;
    }
  };