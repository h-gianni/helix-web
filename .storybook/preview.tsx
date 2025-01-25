// .storybook/preview.tsx
import * as React from 'react';
import type { Preview } from "@storybook/react";
import { withThemeByDataAttribute } from '@storybook/addon-themes';

// Import only the CSS files that exist in your project structure
import '../src/app/globals.css';
import '../src/styles/tokens/components/index.css';

import '../src/styles/tokens/foundations.css';
import '../src/styles/tokens/semantic.css';
import '../src/styles/tokens/typography.css';

type Story = React.ComponentType;

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    docs: {
      story: {
        inline: true,
      },
    },
    themes: {
      default: 'light',
      list: [
        { name: 'light', dataTheme: 'light' },
        { name: 'dark', dataTheme: 'dark' }
      ],
    },
    backgrounds: {
      default: 'light',
      values: [
        {
          name: 'light',
          value: '#f9f9f9',
        },
        {
          name: 'dark',
          value: '#272727',
        },
      ],
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
    (StoryFn: Story) => (
      <div className="p-4 font-sans" style={{ backgroundColor: 'var(--background-page)' }}>
        <StoryFn />
      </div>
    ),
  ],
};

export default preview;