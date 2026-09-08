import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        cream: '#FAF8F5',
        charcoal: '#1C1917',
        terracotta: '#C25E00',
        olive: '#3F5E4D',
        sand: '#F5F2EC',
      },
    },
  },
  plugins: [],
};
export default config;
