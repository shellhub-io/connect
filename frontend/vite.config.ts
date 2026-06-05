import { resolve } from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'
import wails from '@wailsio/runtime/plugins/vite'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@renderer': resolve(__dirname, 'src'),
      '@bindings': resolve(__dirname, 'bindings/github.com/shellhub-io/connect/internal/services')
    }
  },
  server: {
    host: '127.0.0.1',
    port: Number(process.env.WAILS_VITE_PORT) || 9245,
    strictPort: true
  },
  plugins: [
    vue({
      template: { transformAssetUrls }
    }),
    vuetify({ autoImport: true }),
    // Generates and serves the typed Go bindings under ./bindings
    wails('./bindings')
  ]
})
