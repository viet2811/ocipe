import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8000', // Your Django backend URL
        changeOrigin: true, // Needed for virtual hosting
        // rewrite: (path) => path.replace(/^\/api/, ''), // Remove /api prefix
        // You might need secure: false if your backend is not HTTPS yet
        secure: false,
      },
    },
  },
})
