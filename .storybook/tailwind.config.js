// .storybook/tailwind.config.js
/** @type {import('tailwindcss').Config} */
const baseConfig = require('../tailwind.config.ts');

module.exports = {
  ...baseConfig,
  content: [
    ...baseConfig.content,
    '../src/**/*.stories.@(js|jsx|ts|tsx)',
    '../src/**/*.mdx',
    '../src/styles/**/*.css'
  ],
}