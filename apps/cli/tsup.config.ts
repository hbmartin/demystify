import { defineConfig } from 'tsup'

export default defineConfig({
  name: 'demystify',
  target: 'node18',
  noExternal: ['@demystify'],
  minify: true,
  clean: true,
});
