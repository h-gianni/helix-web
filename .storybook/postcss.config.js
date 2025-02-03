// .storybook/postcss.config.js
module.exports = {
  plugins: {
    'postcss-import': {},
    'tailwindcss/nesting': 'postcss-nesting',
    tailwindcss: {
      config: require.resolve('./tailwind.config.js'),
    },
    autoprefixer: {},
  },
}