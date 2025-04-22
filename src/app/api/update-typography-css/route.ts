import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

interface TypographyToken {
  name: string;
  variable: string;
  value: string;
  category: string;
}

interface UpdateTypographyRequest {
  colorTokens: any[];
  typographyTokens: TypographyToken[];
  spacingTokens: any[];
  shadowTokens: any[];
}

export async function POST(request: NextRequest) {
  try {
    const data: UpdateTypographyRequest = await request.json();
    
    // Try to find the typography.css file in various locations
    let typographyFilePath = '';
    const possiblePaths = [
      path.join(process.cwd(), 'src', 'styles', 'tokens', 'typography.css'),
      path.join(process.cwd(), 'styles', 'tokens', 'typography.css'),
      path.join(process.cwd(), 'src', 'tokens', 'typography.css'),
      path.join(process.cwd(), 'tokens', 'typography.css'),
      path.join(process.cwd(), 'src', 'components', 'ui', 'tokens', 'typography.css'),
      path.join(process.cwd(), 'src', 'app', 'styles', 'tokens', 'typography.css')
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
        typographyFilePath = pathToCheck;
        debugInfo.foundPath = typographyFilePath;
        console.log(`Found typography.css at: ${typographyFilePath}`);
        break;
      } catch {
        // File not found at this path, continue checking
        debugInfo.checkedPaths.push(pathToCheck);
      }
    }
    
    // If file not found anywhere, provide better error message with debug info
    if (!typographyFilePath) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Could not find typography.css file.", 
          debug: debugInfo
        },
        { status: 404 }
      );
    }
    
    // Read the current typography.css file to preserve its structure
    let typographyFileContent = await fs.readFile(typographyFilePath, 'utf-8');
    
    // Update typography tokens
    if (data.typographyTokens.length > 0) {
      data.typographyTokens.forEach(token => {
        // Create a regex that matches the specific variable and its value
        const regex = new RegExp(`(${token.variable}:\\s*)([^;]+)(;)`, 'g');
        const replacement = `$1${token.value}$3`;
        
        if (typographyFileContent.includes(token.variable)) {
          // If variable exists, update it
          typographyFileContent = typographyFileContent.replace(regex, replacement);
        } else {
          // If variable doesn't exist, add it to the appropriate section based on category
          let sectionMarker = '';
          
          switch (token.category) {
            case 'fontFamily':
              sectionMarker = '/* Font Families */';
              break;
            case 'fontSize':
              sectionMarker = '/* Font Sizes */';
              break;
            case 'fontWeight':
              sectionMarker = '/* Font Weights */';
              break;
            case 'lineHeight':
              sectionMarker = '/* Line Heights */';
              break;
            case 'letterSpacing':
              sectionMarker = '/* Letter Spacing */';
              break;
            case 'maxWidth':
              sectionMarker = '/* Max Width */';
              break;
            default:
              sectionMarker = '/* Typography */';
          }
          
          // Look for the section marker
          if (typographyFileContent.includes(sectionMarker)) {
            // Add after the section marker
            typographyFileContent = typographyFileContent.replace(
              sectionMarker,
              `${sectionMarker}\n  ${token.variable}: ${token.value};`
            );
          } else {
            // If section marker not found, add to the end of the file
            typographyFileContent += `\n  ${token.variable}: ${token.value};\n`;
          }
        }
      });
    }
    
    // Write the updated content back to the file
    await fs.writeFile(typographyFilePath, typographyFileContent, 'utf-8');
    
    return NextResponse.json({ 
      success: true,
      message: "Typography tokens updated successfully"
    });
  } catch (error) {
    console.error('Error updating typography.css:', error);
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}