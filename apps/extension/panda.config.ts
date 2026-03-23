import { defineConfig } from '@pandacss/dev';

import { theme } from '../web/theme';

export default defineConfig({
  preflight: true,
  include: [
    './src/**/*.{ts,tsx}',
    '../../packages/a11y-companion/src/**/*.{ts,tsx}',
  ],
  exclude: ['./node_modules'],
  outdir: 'styled-system',
  theme,
  jsxFramework: 'react',
  globalCss: {
    '*': {
      boxSizing: 'border-box',
    },
  },
});
