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
build: {
    cssCodeSplit: false,
    chunkSizeWarningLimit: 1000, // Safe threshold limit for grouped frameworks
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            const pathString = id.toString();

            // 1. GROUP THE CORE ENGINE TOGETHER
            // Reka-ui/Radix and Vue must live together to prevent initialization errors
            if (
              pathString.includes('vue') || 
              pathString.includes('pinia') || 
              pathString.includes('reka-ui') || 
              pathString.includes('@floating-ui')
            ) {
              return 'vendor-core-framework';
            }

            // 2. ISOLATE HEAVY PLUGINS (These are safe to extract solo)
            if (pathString.includes('swiper')) {
              return 'vendor-swiper';
            }
            if (pathString.includes('socket.io-client')) {
              return 'vendor-socket';
            }

            // 3. SEPARATE REMAINING UTILITIES
            if (pathString.includes('axios') || pathString.includes('vue-i18n')) {
              return 'vendor-utils';
            }

            // Catch-all for miscellaneous remaining tiny node_modules
            return 'vendor-others';
          }
        },
        entryFileNames: 'assets/js/[name]-[hash].js',
        chunkFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]'
      }
    }
  },
  // Cleaned up optimizeDeps; let Vite native discovery handle matching modules
  optimizeDeps: {
    exclude: [
      'swiper' // Kept excluded so it loads strictly on layout call
    ]
  }
})
// import { defineConfig } from 'vite'
// import vue from '@vitejs/plugin-vue'
// import path from 'path'
// import tailwindcss from "@tailwindcss/vite";
// // import mkcert from 'vite-plugin-mkcert'
// export default defineConfig({
//   plugins: [vue(), tailwindcss(),
//     // mkcert()
//   ],
//   // server: {
//   //   host: true, // 🔥 Exposes the server to your local Wi-Fi network
//   //   port: 5173,
    
//   // },
//   define: {
//     __VUE_PROD_DEVTOOLS__: false,
//   },
//    resolve: {
//     alias: {
//       '@': path.resolve(__dirname, 'src')
//     }
//   },
//   build: {
//     rollupOptions: {
//       output: {
//         manualChunks: {
//           vue: ['vue', 'vue-router', 'pinia'],
//           ui: ["reka-ui", "@floating-ui/dom", "@floating-ui/core"],
//           swiper: ['swiper'],
//           socket: ['socket.io-client'],
//           i18n: ['vue-i18n'],
//           utils: ["axios"],
//         },
//       },
//     },
//   },
//   optimizeDeps: {
//     include: [
//       "vue",
//       "vue-router",
//       "pinia",
//       "axios",
//       "vue-i18n",
//     ],
//     exclude: [
//       "lucide-vue-next", // prevents full pre-bundling
//       "swiper",          // prevents eager bundling
//     ],
//   },

// })
