import { defineConfig } from '@pandacss/dev'
import { theme } from './theme'

export default defineConfig({
  preflight: true,
  include: [
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
    '../packages/a11y-companion/src/**/*.{ts,tsx}',
  ],
  exclude: ['./node_modules'],
  outdir: 'styled-system',
  theme: theme,
  jsxFramework: 'react',
  globalCss: {
    '*': {
      boxSizing: 'border-box',
    },
    body: {
      margin: 0,
      padding: 0,
      fontFamily: 'system-ui',
      backgroundColor: 'var(--colors-stone-300)',
    },
  },
})
