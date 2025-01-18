import React from 'react';
import type { Preview } from "@storybook/react";
import "./../src/app/globals.css";

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
  },
  decorators: [
    (Story) => React.createElement(
      'div',
      { style: { fontFamily: "'Roboto Flex', sans-serif" } },
      React.createElement(Story, null)
    )
  ],
};

export default preview;