import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

interface ColorToken {
  name: string;
  variable: string;
  value: string;
  category: string;
}

interface SpacingToken {
  name: string;
  variable: string;
  value: string;
}

interface TypographyToken {
  name: string;
  variable: string;
  value: string;
  category: string;
}

interface ShadowToken {
  name: string;
  variable: string;
  value: string;
}

interface UpdateThemeRequest {
  colorTokens: ColorToken[];
  spacingTokens: SpacingToken[];
  typographyTokens: TypographyToken[];
  shadowTokens: ShadowToken[];
}

export async function POST(request: NextRequest) {
  try {
    const data: UpdateThemeRequest = await request.json();
    
    // Try to find the theme.css file in various locations
    let themeFilePath = '';
    const possiblePaths = [
      path.join(process.cwd(), 'src', 'styles', 'tokens', 'theme.css'),
      path.join(process.cwd(), 'styles', 'tokens', 'theme.css'),
      path.join(process.cwd(), 'src', 'tokens', 'theme.css'),
      path.join(process.cwd(), 'tokens', 'theme.css'),
      path.join(process.cwd(), 'src', 'components', 'ui', 'tokens', 'theme.css'),
      path.join(process.cwd(), 'src', 'app', 'styles', 'tokens', 'theme.css')
    ];
    
    // Add debug info to response
    const debugInfo = { 
      checkedPaths: [] as string[],
      foundPath: null as string | null,
      cwd: process.cwd()
    };
    
    for (const pathToCheck of possiblePaths) {
      try {
        await fs.access(pathToCheck);
        themeFilePath = pathToCheck;
        debugInfo.foundPath = themeFilePath;
        console.log(`Found theme.css at: ${themeFilePath}`);
        break;
      } catch {
        // File not found at this path, continue checking
        debugInfo.checkedPaths.push(pathToCheck);
      }
    }
    
    // If file not found anywhere, provide better error message with debug info
    if (!themeFilePath) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Could not find theme.css file.", 
          debug: debugInfo
        },
        { status: 404 }
      );
    }
    
    // Read the current theme.css file to preserve its structure
    let themeFileContent = await fs.readFile(themeFilePath, 'utf-8');
    
    // Replace color tokens
    data.colorTokens.forEach(token => {
      // Create a regex that matches the specific variable and its value
      const regex = new RegExp(`(${token.variable}:\\s*)([^;]+)(;)`, 'g');
      themeFileContent = themeFileContent.replace(regex, `$1${token.value}$3`);
    });
    
    // Replace spacing tokens
    data.spacingTokens.forEach(token => {
      const regex = new RegExp(`(${token.variable}:\\s*)([^;]+)(;)`, 'g');
      themeFileContent = themeFileContent.replace(regex, `$1${token.value}$3`);
    });
    
    // Replace typography tokens
    data.typographyTokens.forEach(token => {
      const regex = new RegExp(`(${token.variable}:\\s*)([^;]+)(;)`, 'g');
      themeFileContent = themeFileContent.replace(regex, `$1${token.value}$3`);
    });
    
    // Replace shadow tokens
    data.shadowTokens.forEach(token => {
      const regex = new RegExp(`(${token.variable}:\\s*)([^;]+)(;)`, 'g');
      themeFileContent = themeFileContent.replace(regex, `$1${token.value}$3`);
    });
    
    // Write the updated content back to the file
    await fs.writeFile(themeFilePath, themeFileContent, 'utf-8');
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating theme.css:', error);
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}