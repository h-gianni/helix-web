// .storybook/main.ts
import type { StorybookConfig } from "@storybook/nextjs";
import type { RuleSetRule } from 'webpack';
import path from 'path';

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [
    "@storybook/addon-onboarding",
    "@storybook/addon-essentials",
    "@chromatic-com/storybook",
    "@storybook/addon-interactions",
    "@storybook/addon-themes",
  ],
  framework: {
    name: "@storybook/nextjs",
    options: {},
  },
  docs: {
    autodocs: true,
  },
  staticDirs: ['../public'],
  webpackFinal: async (config) => {
    if (!config.module?.rules) {
      return config;
    }

    // Type guard for RuleSetRule
    const isRuleSetRule = (rule: any): rule is RuleSetRule => {
      return rule && typeof rule === 'object' && 'test' in rule;
    };

    // Filter out existing CSS rules
    config.module.rules = config.module.rules.filter((rule) => {
      if (!isRuleSetRule(rule)) return true;
      return !(rule.test instanceof RegExp && rule.test.toString() === '/\\.css$/');
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
                require('tailwindcss'),
                require('autoprefixer'),
              ],
            },
          },
        },
      ],
      include: [
        path.resolve(__dirname, '../src'),
        path.resolve(__dirname, '../.storybook'),
      ],
    });

    return config;
  },
};

export default config;