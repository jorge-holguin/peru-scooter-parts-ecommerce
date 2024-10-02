// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'build', // Asegúrate de que la carpeta de salida sea `build`
  },
  server: {
    port: 3000,
  },
  define: {
    'process.env.REACT_APP_API_URL': JSON.stringify(process.env.REACT_APP_API_URL || 'https://peru-scooter-parts-ecommerce.onrender.com/api'),
    'process.env.REACT_APP_SOCKET_URL': JSON.stringify(process.env.REACT_APP_SOCKET_URL || 'https://peru-scooter-parts-ecommerce.onrender.com'),
  }
})
