import React from 'react';
import type { Preview } from "@storybook/react";
import { withThemeByDataAttribute } from '@storybook/addon-themes';

// Import tokens first (these define your custom properties)
import '../src/styles/tokens/foundations.css';
import '../src/styles/tokens/semantic.css';
import '../src/styles/tokens/typography.css';

// Then globals which contains Tailwind directives
// import '../src/styles/globals.css';

// Then component styles
import '../src/styles/components/index.css';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    options: {
      storySort: {
        order: ['Core', 'Composite', 'Patterns', 'Template'],
      },
    },
  },
  decorators: [
    withThemeByDataAttribute({
      themes: {
        light: 'light',
        dark: 'dark',
      },
      defaultTheme: 'light',
      attributeName: 'data-theme',
    }),
    (Story) => (
      <div className="p-4 font-sans w-full">
        <Story />
      </div>
    ),
  ],
};

export default preview;
