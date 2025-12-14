import type { Config } from 'tailwindcss';

/**
 * Tailwind CSS v4 Configuration
 * 
 * Note: In Tailwind v4, theme configuration is done in CSS using @theme directive.
 * This config file only specifies content paths for class detection.
 * See src/app/globals.css for theme configuration.
 */
const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
};

export default config;

