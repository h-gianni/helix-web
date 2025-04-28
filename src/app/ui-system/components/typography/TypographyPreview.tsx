import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/core/Card";
import { Label } from "@/components/ui/core/Label";
import { Separator } from "@/components/ui/core/Separator";
import { TypographyToken } from './types';

interface TypographyPreviewProps {
  fontFamilyTokens: TypographyToken[];
  fontSizeTokens: TypographyToken[];
  fontWeightTokens: TypographyToken[];
  lineHeightTokens: TypographyToken[];
}

const TypographyPreview: React.FC<TypographyPreviewProps> = ({
  fontFamilyTokens,
  fontSizeTokens,
  fontWeightTokens,
  lineHeightTokens
}) => {
  // Utility function to find a token value
  const getTokenValue = (tokens: TypographyToken[], variable: string): string => {
    const token = tokens.find(t => t.variable === variable);
    return token ? token.value : '';
  };

  // Font sizes for display
  const fontSizes = [
    { name: 'Display', variable: '--text-4xl' },
    { name: 'Heading 1', variable: '--text-3xl' },
    { name: 'Heading 2', variable: '--text-2xl' },
    { name: 'Heading 3', variable: '--text-xl' },
    { name: 'Body Large', variable: '--text-lg' },
    { name: 'Body', variable: '--text-base' },
    { name: 'Small', variable: '--text-sm' },
    { name: 'Caption', variable: '--text-xs' },
  ];

  // Font weights for display
  const fontWeights = [
    { name: 'Light', variable: '--font-weight-light' },
    { name: 'Regular', variable: '--font-weight-normal' },
    { name: 'Medium', variable: '--font-weight-medium' },
    { name: 'Bold', variable: '--font-weight-bold' },
  ];

  return (
    <Card className="sticky top-4">
      <CardHeader>
        <CardTitle>Typography Preview</CardTitle>
        <CardDescription>
          See how your typography tokens affect text elements
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {/* Font Family Preview */}
          <div className="space-y-4">
            <Label>Font Families</Label>
            <div className="space-y-3">
              {fontFamilyTokens.map(token => (
                <div key={token.variable} className="p-3 border rounded-md">
                  <p 
                    className="text-lg"
                    style={{ fontFamily: token.value }}
                  >
                    {token.name}: The quick brown fox jumps over the lazy dog.
                  </p>
                  <p className="text-xs font-mono text-foreground-weak mt-2">
                    {token.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
          
          <Separator />
          
          {/* Font Size Preview */}
          <div className="space-y-4">
            <Label>Font Sizes</Label>
            <div className="space-y-3">
              {fontSizes.map(size => (
                <div key={size.variable} className="flex items-baseline">
                  <span className="w-24 text-xs font-mono text-foreground-weak">
                    {size.name}
                  </span>
                  <p style={{ fontSize: getTokenValue(fontSizeTokens, size.variable) }}>
                    Example of {size.name} text
                  </p>
                </div>
              ))}
            </div>
          </div>
          
          <Separator />
          
          {/* Font Weight Preview */}
          <div className="space-y-4">
            <Label>Font Weights</Label>
            <div className="space-y-3">
              {fontWeights.map(weight => (
                <div key={weight.variable} className="flex items-baseline">
                  <span className="w-20 text-xs font-mono text-foreground-weak">
                    {weight.name}
                  </span>
                  <p style={{ fontWeight: getTokenValue(fontWeightTokens, weight.variable) }}>
                    Text with {weight.name} weight
                  </p>
                </div>
              ))}
            </div>
          </div>
          
          <Separator />
          
          {/* Line Height Preview */}
          <div className="space-y-4">
            <Label>Line Heights</Label>
            <div className="space-y-6">
              {lineHeightTokens.map(token => (
                <div key={token.variable} className="border p-3 rounded-md">
                  <p className="text-xs font-mono text-foreground-weak mb-1">
                    {token.name} ({token.value})
                  </p>
                  <p 
                    style={{ lineHeight: token.value }}
                    className="border-l-2 border-primary-300 pl-3"
                  >
                    This is an example of text with {token.name.toLowerCase()} line height. 
                    Notice how the spacing between these lines changes based on the line height value.
                    Multiple lines help demonstrate the effect more clearly.
                  </p>
                </div>
              ))}
            </div>
          </div>
          
          <Separator />
          
          {/* Heading Styles Preview */}
          <div className="space-y-4">
            <Label>Heading Styles</Label>
            <div className="space-y-6 border p-4 rounded-md">
              <h1 className="heading-1">Heading 1</h1>
              <h2 className="heading-2">Heading 2</h2>
              <h3 className="heading-3">Heading 3</h3>
              <h4 className="heading-4">Heading 4</h4>
              <h5 className="heading-5">Heading 5</h5>
              <h6 className="heading-6">Heading 6</h6>
            </div>
          </div>
          
          {/* Body Text Preview */}
          <div className="space-y-4">
            <Label>Body Text</Label>
            <div className="space-y-6 border p-4 rounded-md">
              <p className="body-lg">This is large body text, typically used for important paragraphs or featured content that needs to be more prominent.</p>
              <p className="body-base">This is the standard body text used throughout the interface for most content. It balances readability with space efficiency.</p>
              <p className="body-sm">This is small body text, used for secondary information, footnotes, or areas where space is limited but legibility is still important.</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TypographyPreview;