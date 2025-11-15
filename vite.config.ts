import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

import { tanstackRouter } from '@tanstack/router-plugin/vite'
import { resolve } from 'node:path'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    tanstackRouter({ target: 'react', autoCodeSplitting: true }),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'script',
      manifest: {
        name: 'Base VietQR PWA',
        short_name: 'Base VietQR',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#ffffff',
        icons: [
          {
            src: '/logo192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/logo512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    }),
    react(),
  ],

  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  // Either raise Rollup output target:
  build: {
    // ES2022 includes top-level await
    target: ['es2022', 'chrome100', 'edge100', 'firefox102', 'safari15.4'],
  },
  // And/Or raise esbuild’s transform target:
  esbuild: {
    target: 'es2022',
  },
})
