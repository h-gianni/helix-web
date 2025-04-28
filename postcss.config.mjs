/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    'postcss-import': {},
    '@tailwindcss/postcss': {
      content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
      ],
      darkMode: 'class',
      // Remove theme extension temporarily
    },
    'postcss-nesting': {},
    'autoprefixer': {},
  },
};

export default config;