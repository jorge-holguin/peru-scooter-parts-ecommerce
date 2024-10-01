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
})
