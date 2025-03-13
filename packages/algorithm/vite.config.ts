import { defineConfig } from 'vite'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import dts from 'vite-plugin-dts'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'), // Changed from .js to .ts
      name: 'algorithm',
      fileName: (format: string) => `index.${format}.js`
    }
  },
  plugins: [
    dts({
      include: ['src/**/*'],
      entryRoot: 'src',
      insertTypesEntry: true,
      rollupTypes: true,
      
    })
  ]
})