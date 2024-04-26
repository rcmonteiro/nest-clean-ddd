import swc from 'unplugin-swc'
import tsConfigPaths from 'vite-tsconfig-paths'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    root: './',
    exclude: ['**/data/pg/**', './node_modules/**'],
    coverage: {
      include: ['**/*.ts', '**/*.spec.ts', '**/*.e2e-spec.ts'],
      exclude: ['**/data/pg/**', './node_modules/**'],
      reporter: ['text', 'json', 'html'],
    },
  },
  plugins: [
    tsConfigPaths(),
    swc.vite({
      module: { type: 'es6' },
    }),
  ],
})
