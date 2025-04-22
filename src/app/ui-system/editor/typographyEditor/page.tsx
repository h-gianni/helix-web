"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/core/Card";
import { Button } from "@/components/ui/core/Button";

// Import components
import TypographyCategoryEditor from '@/app/ui-system/components/typography/TypographyCategoryEditor';
import TypographyPreview from '@/app/ui-system/components/typography/TypographyPreview';

// Import types and utilities
import { TypographyToken, TYPOGRAPHY_CATEGORIES } from '@/app/ui-system/components/typography/types';
import { loadTypographyTokens } from '@/app/ui-system/components/typography/utils';

const TypographyEditor = () => {
  const [allTypographyTokens, setAllTypographyTokens] = useState<TypographyToken[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize typography tokens
  useEffect(() => {
    console.log("Initializing all typography tokens");
    // Load tokens
    const initialTokens = loadTypographyTokens();
    setAllTypographyTokens(initialTokens);
    
    // Try to load computed values if available
    const loadComputedStyles = () => {
      try {
        const computedStyle = getComputedStyle(document.documentElement);
        
        setAllTypographyTokens(prev => 
          prev.map(token => {
            const computedValue = computedStyle.getPropertyValue(token.variable).trim();
            return computedValue ? 
              { ...token, value: computedValue } : 
              token;
          })
        );
        console.log('Updated typography tokens with computed styles');
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
    
    allTypographyTokens.forEach(token => {
      root.style.setProperty(token.variable, token.value);
    });
  }, [allTypographyTokens]);

  // Handle token changes for a specific category
  const handleTokensChange = (category: string, newTokens: TypographyToken[]) => {
    setAllTypographyTokens(prev => {
      // Filter out old tokens from this category
      const otherTokens = prev.filter(token => token.category !== category);
      // Add the new tokens
      return [...otherTokens, ...newTokens];
    });
  };

  // Save tokens to typography.css
  const saveTokensToCSS = async () => {
    try {
      // Show saving indicator
      const saveButton = document.querySelector('[data-save-button]') as HTMLButtonElement;
      if (saveButton) {
        saveButton.disabled = true;
        saveButton.textContent = "Saving...";
      }
      
      // Create payload
      const payload = {
        colorTokens: [],
        typographyTokens: allTypographyTokens,
        spacingTokens: [], 
        shadowTokens: []
      };
      
      // Send to API
      const response = await fetch('/api/update-typography-css', {
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
        style.innerHTML = `:root {\n${allTypographyTokens.map(token => 
          `  ${token.variable}: ${token.value};`).join('\n')}\n}`;
        
        // Remove any previous temporary style elements we added
        const oldStyles = document.querySelectorAll('[data-typography-editor-style]');
        oldStyles.forEach(oldStyle => oldStyle.remove());
        
        // Add to head to ensure these values persist
        style.setAttribute('data-typography-editor-style', 'true');
        document.head.appendChild(style);
        
        alert('Typography CSS file updated successfully!');
        
        // Store in localStorage as a backup
        localStorage.setItem('typography-editor-tokens', JSON.stringify(allTypographyTokens));
      } else {
        throw new Error(result.error || 'Failed to update typography.css file');
      }
    } catch (error) {
      console.error('Error updating typography.css:', error);
      alert(`Error updating typography.css: ${(error as Error).message}\n\nCheck the console for more details.`);
    } finally {
      // Reset button state
      const saveButton = document.querySelector('[data-save-button]') as HTMLButtonElement;
      if (saveButton) {
        saveButton.disabled = false;
        saveButton.textContent = "Save to typography.css";
      }
    }
  };

  // Group tokens by category
  const getTokensByCategory = (category: string): TypographyToken[] => {
    return allTypographyTokens.filter(token => token.category === category);
  };

  // Reset to default typography
  const resetTypography = () => {
    // Clear localStorage
    localStorage.removeItem('typography-editor-tokens');
    // Reset to default values
    setAllTypographyTokens(loadTypographyTokens());
  };

  // Get category display name
  const getCategoryDisplayName = (category: string): string => {
    switch(category) {
      case 'fontFamily': return 'Font Families';
      case 'fontSize': return 'Font Sizes';
      case 'fontWeight': return 'Font Weights';
      case 'lineHeight': return 'Line Heights';
      case 'letterSpacing': return 'Letter Spacing';
      case 'maxWidth': return 'Max Widths';
      default: return category;
    }
  };

  // Get font family tokens
  const fontFamilyTokens = getTokensByCategory('fontFamily');
  // Get font size tokens
  const fontSizeTokens = getTokensByCategory('fontSize');
  // Get font weight tokens
  const fontWeightTokens = getTokensByCategory('fontWeight');
  // Get line height tokens
  const lineHeightTokens = getTokensByCategory('lineHeight');

  // Main UI render
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
          <h1 className="display-1">Typography System Editor</h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={resetTypography}>
              Reset
            </Button>
            <Button onClick={saveTokensToCSS} data-save-button>
              Save to typography.css
            </Button>
          </div>
        </div>
        <p className="body-lg text-foreground-weak">
          Edit your design system's typography tokens and see how they affect text elements
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Editor Section */}
        <div className="w-full lg:w-2/3 space-y-6">
          {isLoading ? (
            <Card>
              <CardContent className="flex items-center justify-center py-20">
                <p>Loading typography tokens...</p>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Font Families & Font Sizes (2 columns) */}
              <div>
                <h2 className="heading-3 mb-4">Core Typography</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <TypographyCategoryEditor 
                    category="fontFamily"
                    displayName="Font Families"
                    tokens={getTokensByCategory('fontFamily')}
                    onChange={(tokens) => handleTokensChange('fontFamily', tokens)}
                  />
                  <TypographyCategoryEditor 
                    category="fontSize"
                    displayName="Font Sizes"
                    tokens={getTokensByCategory('fontSize')}
                    onChange={(tokens) => handleTokensChange('fontSize', tokens)}
                  />
                </div>
              </div>
              
              {/* Font Weights & Line Heights (2 columns) */}
              <div>
                <h2 className="heading-3 mb-4">Font Properties</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <TypographyCategoryEditor 
                    category="fontWeight"
                    displayName="Font Weights"
                    tokens={getTokensByCategory('fontWeight')}
                    onChange={(tokens) => handleTokensChange('fontWeight', tokens)}
                  />
                  <TypographyCategoryEditor 
                    category="lineHeight"
                    displayName="Line Heights"
                    tokens={getTokensByCategory('lineHeight')}
                    onChange={(tokens) => handleTokensChange('lineHeight', tokens)}
                  />
                </div>
              </div>
              
              {/* Letter Spacing & Max Widths (2 columns) */}
              <div>
                <h2 className="heading-3 mb-4">Advanced Typography</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <TypographyCategoryEditor 
                    category="letterSpacing"
                    displayName="Letter Spacing"
                    tokens={getTokensByCategory('letterSpacing')}
                    onChange={(tokens) => handleTokensChange('letterSpacing', tokens)}
                  />
                  <TypographyCategoryEditor 
                    category="maxWidth"
                    displayName="Max Widths"
                    tokens={getTokensByCategory('maxWidth')}
                    onChange={(tokens) => handleTokensChange('maxWidth', tokens)}
                  />
                </div>
              </div>
            </>
          )}
        </div>

        {/* Preview Section */}
        <div className="w-full lg:w-1/3">
          <TypographyPreview 
            fontFamilyTokens={fontFamilyTokens}
            fontSizeTokens={fontSizeTokens}
            fontWeightTokens={fontWeightTokens}
            lineHeightTokens={lineHeightTokens}
          />
        </div>
      </div>
    </div>
  );
};

export default TypographyEditor;