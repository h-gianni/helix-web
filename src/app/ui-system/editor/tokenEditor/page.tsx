"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/core/Card";
import { Button } from "@/components/ui/core/Button";
import { useTheme } from "next-themes";

// Import components
import ColorPaletteEditor from '@/app/ui-system/components/colorPalette/ColorPaletteEditor';
import ComponentPreview from '@/app/ui-system/components/colorPalette/ComponentPreview';

import { ColorToken, COLOR_CATEGORIES, TokenUpdatePayload } from '@/app/ui-system/components/colorPalette/types';
import { initializeColorPalette } from '@/app/ui-system/components/colorPalette/utils';

const TokenEditor = () => {
  const { theme } = useTheme();
  
  // State for all color tokens
  const [allColorTokens, setAllColorTokens] = useState<ColorToken[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize color tokens
  useEffect(() => {
    console.log("Initializing all color tokens");
    // Initialize with default values - create an array with all color categories
    const initialTokens: ColorToken[] = [];
    COLOR_CATEGORIES.forEach(category => {
      const categoryTokens = initializeColorPalette(category);
      initialTokens.push(...categoryTokens);
    });
    
    setAllColorTokens(initialTokens);
    console.log(`Initialized ${initialTokens.length} total tokens`);
    
    // Try to load computed values if available
    const loadComputedStyles = () => {
      try {
        const computedStyle = getComputedStyle(document.documentElement);
        
        setAllColorTokens(prev => 
          prev.map(token => {
            const computedValue = computedStyle.getPropertyValue(token.variable).trim();
            return computedValue ? 
              { ...token, value: computedValue } : 
              token;
          })
        );
        console.log('Updated with computed styles');
      } catch (error) {
        console.error('Error loading computed styles:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (document.readyState === 'complete') {
      loadComputedStyles();
    } else {
      window.addEventListener('load', loadComputedStyles);
      return () => window.removeEventListener('load', loadComputedStyles);
    }
  }, []);
  
  // Apply CSS variable changes
  useEffect(() => {
    const root = document.documentElement;
    
    allColorTokens.forEach(token => {
      root.style.setProperty(token.variable, token.value);
    });
  }, [allColorTokens]);
  
  // Load initial values from computed styles if available
  useEffect(() => {
    const loadComputedTokens = () => {
      try {
        const computedStyle = getComputedStyle(document.documentElement);
        
        // Update tokens with computed values if they exist
        setAllColorTokens(prev => 
          prev.map(token => {
            const computedValue = computedStyle.getPropertyValue(token.variable).trim();
            return computedValue ? 
              { ...token, value: computedValue } : 
              token;
          })
        );
        console.log('Loaded color tokens from computed styles');
      } catch (error) {
        console.error('Error loading computed styles:', error);
      }
    };
    
    // Try to load computed styles if we don't have saved tokens
    if (!localStorage.getItem('token-editor-colors') && document.readyState === 'complete') {
      loadComputedTokens();
    }
  }, []);

  // Handle token changes for a specific category
  const handleTokenChange = (category: string, newTokens: ColorToken[]) => {
    setAllColorTokens(prev => {
      // Replace tokens for the given category
      const filtered = prev.filter(token => !token.variable.startsWith(`--${category}-`));
      return [...filtered, ...newTokens];
    });
  };

  // Save tokens to theme.css
  const saveTokensToThemeCSS = async () => {
    try {
      // Show saving indicator
      const saveButton = document.querySelector('[data-save-button]') as HTMLButtonElement;
      if (saveButton) {
        saveButton.disabled = true;
        saveButton.textContent = "Saving...";
      }
      
      // Create payload
      const payload: TokenUpdatePayload = {
        colorTokens: allColorTokens,
        spacingTokens: [], 
        typographyTokens: [],
        shadowTokens: []
      };
      
      // Send to API
      const response = await fetch('/api/update-theme-css', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });
      
      const result = await response.json();
      
      if (response.ok && result.success) {
        // Create style element with updated CSS variables
        const style = document.createElement('style');
        style.innerHTML = `:root {\n${allColorTokens.map(token => 
          `  ${token.variable}: ${token.value};`).join('\n')}\n}`;
        
        // Remove any previous temporary style elements we added
        const oldStyles = document.querySelectorAll('[data-token-editor-style]');
        oldStyles.forEach(oldStyle => oldStyle.remove());
        
        // Add to head to ensure these values persist
        style.setAttribute('data-token-editor-style', 'true');
        document.head.appendChild(style);
        
        alert('Theme CSS file updated successfully!');
        
        // Store in localStorage as a backup
        localStorage.setItem('token-editor-colors', JSON.stringify(allColorTokens));
      } else {
        throw new Error(result.error || 'Failed to update theme.css file');
      }
    } catch (error) {
      console.error('Error updating theme.css:', error);
      alert(`Error updating theme.css: ${(error as Error).message}\n\nCheck the console for more details.`);
    } finally {
      // Reset button state
      const saveButton = document.querySelector('[data-save-button]') as HTMLButtonElement;
      if (saveButton) {
        saveButton.disabled = false;
        saveButton.textContent = "Save to theme.css";
      }
    }
  };

  // Reset to default colors
  const resetColors = () => {
    // Clear localStorage
    localStorage.removeItem('token-editor-colors');
    
    // Re-initialize all color tokens from defaults
    const defaultTokens: ColorToken[] = [];
    COLOR_CATEGORIES.forEach(category => {
      const categoryTokens = initializeColorPalette(category);
      defaultTokens.push(...categoryTokens);
    });
    
    setAllColorTokens(defaultTokens);
  };

  // Group tokens by category
  const getTokensByCategory = (category: string): ColorToken[] => {
    const categoryTokens = allColorTokens.filter(token => token.category === category);
    
    // If we don't have any tokens for this category, initialize default ones
    if (categoryTokens.length === 0) {
      console.log(`No tokens found for ${category}, creating defaults`);
      return initializeColorPalette(category);
    }
    
    return categoryTokens;
  };

  // Main UI render
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
          <h1 className="display-1">Color System Editor</h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={resetColors}>
              Reset
            </Button>
            <Button onClick={saveTokensToThemeCSS} data-save-button>
              Save to theme.css
            </Button>
          </div>
        </div>
        <p className="body-lg text-foreground-weak">
          Edit your design system's color palettes and see how they affect components
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Editor Section */}
        <div className="w-full lg:w-2/3 space-y-6">
          {isLoading ? (
            <Card>
              <CardContent className="flex items-center justify-center py-20">
                <p>Loading color palettes...</p>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Main Color Palettes (3 columns) */}
              <div>
                <div className="flex flex-col gap-4">
                  <ColorPaletteEditor 
                    category="neutral" 
                    tokens={getTokensByCategory('neutral')} 
                    onChange={(tokens) => handleTokenChange('neutral', tokens)}
                  />
                  <ColorPaletteEditor 
                    category="primary" 
                    tokens={getTokensByCategory('primary')} 
                    onChange={(tokens) => handleTokenChange('primary', tokens)}
                  />
                  <ColorPaletteEditor 
                    category="secondary" 
                    tokens={getTokensByCategory('secondary')} 
                    onChange={(tokens) => handleTokenChange('secondary', tokens)}
                  />
                  <ColorPaletteEditor 
                    category="tertiary" 
                    tokens={getTokensByCategory('tertiary')} 
                    onChange={(tokens) => handleTokenChange('tertiary', tokens)}
                  />
                  <ColorPaletteEditor 
                    category="accent" 
                    tokens={getTokensByCategory('accent')} 
                    onChange={(tokens) => handleTokenChange('accent', tokens)}
                  />
                </div>
              </div>
              
              {/* Semantic Color Palettes (4 columns) */}
              <div>
              <div className="flex flex-col gap-4">
                  <ColorPaletteEditor 
                    category="info" 
                    tokens={getTokensByCategory('info')} 
                    onChange={(tokens) => handleTokenChange('info', tokens)}
                  />
                  <ColorPaletteEditor 
                    category="success" 
                    tokens={getTokensByCategory('success')} 
                    onChange={(tokens) => handleTokenChange('success', tokens)}
                  />
                  <ColorPaletteEditor 
                    category="warning" 
                    tokens={getTokensByCategory('warning')} 
                    onChange={(tokens) => handleTokenChange('warning', tokens)}
                  />
                  <ColorPaletteEditor 
                    category="destructive" 
                    tokens={getTokensByCategory('destructive')} 
                    onChange={(tokens) => handleTokenChange('destructive', tokens)}
                  />
                </div>
              </div>
            </>
          )}
        </div>

        {/* Preview Section */}
        <div className="w-full lg:w-1/3">
          <ComponentPreview />
        </div>
      </div>
    </div>
  );
};

export default TokenEditor;