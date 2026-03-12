import { defineConfig } from 'vite'

export default defineConfig({
  base: './',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: 'index.html',
        venta: 'venta.html',
        alquiler: 'alquiler.html',
        empresa: 'empresa.html'
      }
    }
  }
})
