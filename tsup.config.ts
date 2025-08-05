import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: 'cjs',
  outDir: 'bin',
  target: 'node18',
  clean: true,
  splitting: false,
  sourcemap: true,
  dts: false,
  banner: {
    js: '#!/usr/bin/env node',
  },
})
