import swc from 'unplugin-swc'
import tsConfigPaths from 'vite-tsconfig-paths'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['**/*.e2e-spec.ts'],
    globals: true,
    root: './',
    exclude: ['**/data/pg/**'],
    setupFiles: ['./test/setup-e2e.ts'],
    coverage: {
      include: ['**/*.ts', '**/*.spec.ts', '**/*.e2e-spec.ts'],
      exclude: ['**/data/pg/**', './node_modules/**'],
    },
  },
  plugins: [
    tsConfigPaths(),
    swc.vite({
      module: { type: 'es6' },
    }),
  ],
})
