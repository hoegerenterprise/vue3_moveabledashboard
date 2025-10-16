import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vuetify from 'vite-plugin-vuetify'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue(), vuetify({ autoImport: true })],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'Vue3MoveableDashboard',
      fileName: (format) => `index.${format}.js`,
      formats: ['es', 'cjs']
    },
    rollupOptions: {
      // Externalize dependencies that shouldn't be bundled
      external: ['vue', 'vuetify', 'vue3-moveable'],
      output: {
        // Global variable names for UMD build
        globals: {
          vue: 'Vue',
          vuetify: 'Vuetify',
          'vue3-moveable': 'Vue3Moveable'
        },
        // Preserve CSS
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'style.css') return 'style.css';
          return assetInfo.name || 'asset';
        }
      }
    },
    cssCodeSplit: false
  }
})
