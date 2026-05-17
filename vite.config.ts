import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import tailwindcss from "@tailwindcss/vite";
// import mkcert from 'vite-plugin-mkcert'
export default defineConfig({
  plugins: [vue(), tailwindcss(),
    // mkcert()
  ],
  // server: {
  //   host: true, // 🔥 Exposes the server to your local Wi-Fi network
  //   port: 5173,
    
  // },
   resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },

})
