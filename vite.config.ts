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
            
            // 1. Core Framework (Always needed, caches beautifully)
            if (
              pathString.includes('vue') || 
              pathString.includes('pinia') || 
              pathString.includes('reka-ui') || 
              pathString.includes('@floating-ui')
            ) {
              return 'vendor-core';
            }
            
            // 2. Swiper (We set this to defineAsyncComponent earlier, 
            // so isolating it means it won't block the initial load!)
            if (pathString.includes('swiper')) {
              return 'vendor-swiper';
            }
            
            // 3. Sockets (Only isolate if it's heavy)
            if (pathString.includes('socket.io-client')) {
              return 'vendor-socket';
            }

            // REMOVED: vendor-utils and vendor-others
            // By omitting a return statement here, Vite will automatically slice up 
            // all remaining libraries. If a library is only used on a lazy-loaded route, 
            // Vite will bundle it with that route, completely removing it from the initial load!
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

// import { defineConfig } from 'vite'
// import vue from '@vitejs/plugin-vue'
// import path from 'path'
// import tailwindcss from "@tailwindcss/vite"
// export default defineConfig({
//   plugins: [
//     vue(), 
//     tailwindcss()
//   ],
//   define: {
//     __VUE_PROD_DEVTOOLS__: false,
//   },
//   resolve: {
//     alias: {
//       '@': path.resolve(__dirname, 'src')
//     }
//   },
//   esbuild: {
//     pure: ['console.log'],
//   },
//   build: {
//     cssCodeSplit: false,
//     sourcemap: false,
//     chunkSizeWarningLimit: 1000, 
//     rollupOptions: {
//       output: {
//         manualChunks(id) {
//           if (id.includes('node_modules')) {
//             const pathString = id.toString();
//             if (
//               pathString.includes('vue') || 
//               pathString.includes('pinia') || 
//               pathString.includes('reka-ui') || 
//               pathString.includes('@floating-ui')
//             ) {
//               return 'vendor-core-framework';
//             }
//             if (pathString.includes('swiper')) {
//               return 'vendor-swiper';
//             }
//             if (pathString.includes('socket.io-client')) {
//               return 'vendor-socket';
//             }
//             if (pathString.includes('axios') || pathString.includes('vue-i18n')) {
//               return 'vendor-utils';
//             }
//             return 'vendor-others';
//           }
//         },
//         entryFileNames: 'assets/js/[name]-[hash].js',
//         chunkFileNames: 'assets/js/[name]-[hash].js',
//         assetFileNames: 'assets/[ext]/[name]-[hash].[ext]'
//       }
//     }
//   },
//   optimizeDeps: {
//     exclude: [
//       'swiper'
//     ]
//   }
// })
