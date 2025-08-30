// vite.config.public.ts
import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({

  build: {
    outDir: resolve(__dirname, '../../web/static/react/public'), // ← Ruta ABSOLUTA
    emptyOutDir: true,
    lib: {
      entry: resolve(__dirname, './public/components/ChatCitaPublico.jsx'),
      name: 'ChatCitaPublico',
      fileName: () => 'chatCita.js',
      formats: ['umd']
    },
    rollupOptions: {
      external: ['react', 'react-dom'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM'
        }
      }
    }
  }
})