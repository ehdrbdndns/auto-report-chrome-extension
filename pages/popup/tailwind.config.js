const baseConfig = require('@extension/tailwindcss-config');
const flowbite = require('flowbite-react/tailwind');

/** @type {import('tailwindcss').Config} */
module.exports = {
  ...baseConfig,
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}', flowbite.content()],
  plugins: [...baseConfig.plugins, flowbite.plugin()],
};
