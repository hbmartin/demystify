import { resolve } from 'node:path';
import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
  extensionApi: 'chrome',
  modules: ['@wxt-dev/module-vue', '@wxt-dev/auto-icons'],
  manifest: {
    host_permissions: ['<all_urls>'], // Allows API client to make requests CORS requests to all domains
  },
  alias: {
    "@/components/ui": resolve("../../packages/ui/src/components/ui"),
    "@/lib": resolve("../../packages/ui/src/lib"),
  },
});
