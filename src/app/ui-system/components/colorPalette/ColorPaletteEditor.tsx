import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/core/Card";
import { Label } from "@/components/ui/core/Label";
import { Input } from "@/components/ui/core/Input";
import { ColorToken } from './types';
import { colorToHex, hexToHsl, updateColorPaletteTokens } from './utils';

interface ColorPaletteEditorProps {
  category: string;
  tokens: ColorToken[];
  onChange: (newTokens: ColorToken[]) => void;
}

const ColorPaletteEditor: React.FC<ColorPaletteEditorProps> = ({ 
  category, 
  tokens, 
  onChange 
}) => {
  // Get the 500 shade for this color category
  const baseToken = tokens.find(t => t.variable === `--${category}-500`);
  const baseColorValue = baseToken?.value || `hsl(0 0% 50%)`;
  
  // For debugging
  if (!baseToken) {
    console.log(`No base token found for ${category}. Available tokens:`, tokens);
  }
  
  // Handle color changes
  const handleColorChange = (newValue: string) => {
    const updatedTokens = updateColorPaletteTokens(tokens, newValue);
    onChange(updatedTokens);
  };
  
  // Convert HSL to hex for color picker
  const baseColorHex = colorToHex(baseColorValue);
  
  // Handle color picker change
  const handleColorPickerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const hexColor = e.target.value;
    // Convert hex to HSL
    const hsl = hexToHsl(hexColor);
    if (hsl) {
      handleColorChange(`hsl(${hsl.h} ${hsl.s}% 50%)`);
    }
  };
  
  const displayName = category.charAt(0).toUpperCase() + category.slice(1);
  
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>{displayName}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Color picker */}
          <div className="space-y-2">
            {/* <Label htmlFor={`${category}-color-picker`}>Edit Base Color</Label> */}
            <div className="flex gap-3">
              <input 
                type="color" 
                id={`${category}-color-picker`}
                className="h-12 w-16 -mt-1 cursor-pointer"
                value={baseColorHex}
                onChange={handleColorPickerChange}
              />
              <div className="">
                <Input
                  id={`${category}-color-input`}
                  value={baseColorValue}
                  onChange={(e) => handleColorChange(e.target.value)}
                  placeholder="hsl(0 0% 50%)"
                />
              </div>
            </div>
          </div>
          
          {/* Color shades preview */}
          <div className="mt-4">
            {/* <h3 className="text-sm font-medium mb-2">Color Scale</h3> */}
            <div className="flex">
              {tokens.map(token => (
                <div key={token.variable} className="flex flex-col items-center w-full">
                  <div 
                    className="h-6 w-full flex-shrink-0" 
                    style={{ backgroundColor: token.value }}
                  ></div>
                  <div>
                    <p className="text-xs font-mono text-foreground-weak pt-2">{token.variable.match(/\d+/)?.[0] || ''}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ColorPaletteEditor;