// .storybook/main.ts
import type { StorybookConfig } from "@storybook/nextjs";
import path from 'path';

const config: StorybookConfig = {
  // stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  stories: [
    '../src/components/ui/core/**/*.stories.@(js|jsx|ts|tsx)',       // Core components (e.g., Button, Input)
    '../src/components/ui/composite/**/*.stories.@(js|jsx|ts|tsx)',  // Composite components (e.g., Sidebar, Modal)
    '../src/components/ui/pattern/**/*.stories.@(js|jsx|ts|tsx)',   // Pattern components (e.g., Forms, Cards)
    '../src/components/ui/layout/**/*.stories.@(js|jsx|ts|tsx)',   // Layout components (e.g., Page layouts)
  ],
  addons: [
    "@storybook/addon-onboarding",
    "@storybook/addon-essentials",
    "@storybook/addon-themes",
  ],
  framework: {
    name: "@storybook/nextjs",
    options: {},
  },
  
  webpackFinal: async (config) => {
    if (!config.module?.rules) {
      return config;
    }

    // Filter out default CSS rules
    config.module.rules = config.module.rules.filter((rule) => {
      if (typeof rule === 'string') return true;
      if (!rule || typeof rule !== 'object') return true;
      if (!rule.test) return true;
      return !(rule.test instanceof RegExp && rule.test.test('test.css'));
    });

    // Add our custom CSS handling
    config.module.rules.push({
      test: /\.css$/,
      use: [
        'style-loader',
        {
          loader: 'css-loader',
          options: {
            importLoaders: 1,
          },
        },
        {
          loader: 'postcss-loader',
          options: {
            postcssOptions: {
              plugins: [
                require('postcss-import'),
                require('tailwindcss/nesting'),
                require('tailwindcss'),
                require('autoprefixer'),
              ],
            },
          },
        },
      ],
      include: [
        path.resolve(__dirname, '../src'),
        path.resolve(__dirname, '../src/styles'),
        path.resolve(__dirname, '../.storybook'),
      ],
    });

    return config;
  },
};

export default config;