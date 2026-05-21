import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import tailwindcss from "@tailwindcss/vite"
export default defineConfig({
  plugins: [
    vue(), 
    tailwindcss()
  ],
  define: {
    __VUE_PROD_DEVTOOLS__: false,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  esbuild: {
    pure: ['console.log'],
  },
  build: {
    cssCodeSplit: false,
    sourcemap: false,
    chunkSizeWarningLimit: 1000, 
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            const pathString = id.toString();
            if (
              pathString.includes('vue') || 
              pathString.includes('pinia') || 
              pathString.includes('reka-ui') || 
              pathString.includes('@floating-ui')
            ) {
              return 'vendor-core-framework';
            }
            if (pathString.includes('swiper')) {
              return 'vendor-swiper';
            }
            if (pathString.includes('socket.io-client')) {
              return 'vendor-socket';
            }
            if (pathString.includes('axios') || pathString.includes('vue-i18n')) {
              return 'vendor-utils';
            }
            return 'vendor-others';
          }
        },
        entryFileNames: 'assets/js/[name]-[hash].js',
        chunkFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]'
      }
    }
  },
  optimizeDeps: {
    exclude: [
      'swiper'
    ]
  }
})
