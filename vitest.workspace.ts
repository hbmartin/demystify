import { defineWorkspace } from 'vitest/config'

export default defineWorkspace([
  "./apps/website/vite.config.ts",
  "./packages/algorithm/vite.config.ts",
  "./apps/desktop/frontend/vite.config.ts"
])
