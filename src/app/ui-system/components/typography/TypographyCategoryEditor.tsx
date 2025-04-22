import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/core/Card";
import { Label } from "@/components/ui/core/Label";
import { Input } from "@/components/ui/core/Input";
import { Button } from "@/components/ui/core/Button";
import { Alert, AlertDescription } from "@/components/ui/core/Alert";
import { PlusCircle, Trash2 } from "lucide-react";
import { TypographyToken } from './types';
import { validateTypographyValue } from './utils';

interface TypographyCategoryEditorProps {
  category: string;
  displayName: string;
  tokens: TypographyToken[];
  onChange: (newTokens: TypographyToken[]) => void;
}

const TypographyCategoryEditor: React.FC<TypographyCategoryEditorProps> = ({
  category,
  displayName,
  tokens,
  onChange
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTokenName, setNewTokenName] = useState('');
  const [newTokenValue, setNewTokenValue] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Update an existing token
  const handleTokenUpdate = (index: number, value: string) => {
    // Validate the value based on category
    if (!validateTypographyValue(value, category)) {
      // Allow the change but show warning coloring
      const updatedTokens = [...tokens];
      updatedTokens[index] = { ...updatedTokens[index], value, hasError: true };
      onChange(updatedTokens);
      return;
    }

    // Update the token
    const updatedTokens = [...tokens];
    updatedTokens[index] = { ...updatedTokens[index], value, hasError: false };
    onChange(updatedTokens);
  };

  // Delete a token
  const handleDeleteToken = (index: number) => {
    const updatedTokens = tokens.filter((_, i) => i !== index);
    onChange(updatedTokens);
  };

  // Add a new token
  const handleAddToken = () => {
    setError(null);
    
    // Validate input
    if (!newTokenName.trim()) {
      setError('Token name is required');
      return;
    }
    
    // Create variable name from token name
    const variablePrefix = getVariablePrefix(category);
    const variableSuffix = newTokenName.toLowerCase().replace(/\s+/g, '-');
    const variable = `${variablePrefix}${variableSuffix}`;
    
    // Check if token with this variable already exists
    if (tokens.some(token => token.variable === variable)) {
      setError('A token with this name already exists');
      return;
    }
    
    // Validate the value
    if (!validateTypographyValue(newTokenValue, category)) {
      setError(`Invalid value for ${category} token`);
      return;
    }
    
    // Create the new token
    const newToken: TypographyToken = {
      name: newTokenName,
      variable,
      value: newTokenValue,
      category
    };
    
    // Add the token and reset form
    onChange([...tokens, newToken]);
    setNewTokenName('');
    setNewTokenValue('');
    setShowAddForm(false);
  };

  // Get the variable prefix based on category
  const getVariablePrefix = (category: string): string => {
    switch(category) {
      case 'fontSize':
        return '--text-';
      case 'fontWeight':
        return '--font-weight-';
      case 'lineHeight':
        return '--leading-';
      case 'letterSpacing':
        return '--tracking-';
      case 'fontFamily':
        return '--font-';
      case 'maxWidth':
        return '--max-width-';
      default:
        return '--';
    }
  };

  // Get default placeholder based on category
  const getPlaceholder = (category: string): string => {
    switch(category) {
      case 'fontSize':
        return '1rem';
      case 'fontWeight':
        return '400';
      case 'lineHeight':
        return '1.5';
      case 'letterSpacing':
        return '0';
      case 'fontFamily':
        return '"Font Name", system-ui, sans-serif';
      case 'maxWidth':
        return '65ch';
      default:
        return '';
    }
  };

  // Get custom name based on category
  const getCustomNameExample = (category: string): string => {
    switch(category) {
      case 'fontSize':
        return 'lg';
      case 'fontWeight':
        return 'medium';
      case 'lineHeight':
        return 'normal';
      case 'letterSpacing':
        return 'wide';
      case 'fontFamily':
        return 'serif';
      case 'maxWidth':
        return 'prose';
      default:
        return 'custom';
    }
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>{displayName}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Existing tokens */}
          {tokens.map((token, index) => (
            <div key={token.variable} className="flex items-center gap-2">
              <div className="flex-1">
                <Label htmlFor={`token-${token.variable}`} className="text-xs">
                  {token.name}
                  <span className="ml-2 text-foreground-weak font-mono">
                    {token.variable}
                  </span>
                </Label>
                <Input
                  id={`token-${token.variable}`}
                  value={token.value}
                  onChange={(e) => handleTokenUpdate(index, e.target.value)}
                  className={token.hasError ? "border-destructive-300" : ""}
                />
              </div>
              {tokens.length > 1 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive"
                  onClick={() => handleDeleteToken(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}

          {/* Add new token form */}
          {showAddForm ? (
            <div className="border rounded-md p-3 space-y-3 mt-2">
              <h4 className="text-sm font-medium">Add New {displayName} Token</h4>
              
              {error && (
                <Alert variant="destructive" className="py-2">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <div className="space-y-2">
                <Label htmlFor={`new-token-name-${category}`}>Name</Label>
                <Input
                  id={`new-token-name-${category}`}
                  value={newTokenName}
                  onChange={(e) => setNewTokenName(e.target.value)}
                  placeholder={`e.g., ${getCustomNameExample(category)}`}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor={`new-token-value-${category}`}>Value</Label>
                <Input
                  id={`new-token-value-${category}`}
                  value={newTokenValue}
                  onChange={(e) => setNewTokenValue(e.target.value)}
                  placeholder={getPlaceholder(category)}
                />
              </div>
              
              <div className="flex gap-2 justify-end">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowAddForm(false)}
                >
                  Cancel
                </Button>
                <Button 
                  size="sm"
                  onClick={handleAddToken}
                >
                  Add Token
                </Button>
              </div>
            </div>
          ) : (
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => setShowAddForm(true)}
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Add New {displayName} Token
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TypographyCategoryEditor;