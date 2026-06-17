import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import tailwindcss from "@tailwindcss/vite";
import ogPlugin from "vite-plugin-open-graph";
export default defineConfig({
  plugins: [
    vue(), 
    tailwindcss(),
    ogPlugin({
      basic:{
        url:"https://tz99x.com",
        title:"TZ99",
        type:"website",
        image:"https://tz99x.com/favicon.webp",
        description:"立即加入游戏，赢取奖励！"
      }
    })
  ],
  // server: {
  //   host: '0.0.0.0', // allow access from other devices
  //   port: 5173,
  //  // enable HTTPS for secure local development
  // },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      // moment: 'moment/min/moment.min.js',
      // 'moment-timezone': 'moment-timezone/builds/moment-timezone-with-data-10-year-range.min.js'
    }
  },
  // define: {
  //   __VUE_PROD_DEVTOOLS__: false,
  // },
  // esbuild: {
  //   pure: ['console.log'],
  //   drop: ["console", "debugger"],
  // },
  build: {
    minify: "esbuild",
    cssCodeSplit: true,
    sourcemap: false,
    chunkSizeWarningLimit: 1000, 
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            const pathString = id.toString();
            if (pathString.includes('lucide-vue-next')) {
              return 'vendor-icons';
            }
            if (
              pathString.includes('/vue/') ||
              pathString.includes('/@vue/') ||
              pathString.includes('vue-router') ||
              pathString.includes('vue-i18n') ||
              pathString.includes('pinia') || 
              pathString.includes('@vueuse/core')
            ) {
              return 'vendor-core';
            }
            if (pathString.includes('swiper')) {
              return 'vendor-swiper';
            }
            if (pathString.includes('socket.io-client')) {
              return 'vendor-socket';
            }
            if (pathString.includes('moment')) {
              return 'vendor-date';
            }
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
