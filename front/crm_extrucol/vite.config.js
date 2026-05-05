import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const isApexMode = String(env.VITE_APEX_MODE) === 'true'

  return {
    plugins: [react()],
    server: {
      port: 5173,
      proxy: {
        '/api': {
          target: env.VITE_API_BASE_URL ?? 'http://localhost:8080',
          changeOrigin: true,
        },
        ...(isApexMode && {
          '/apex': {
            target: env.VITE_APEX_TARGET ?? 'https://apex.oracle.com',
            changeOrigin: true,
            secure: false,
          },
        }),
      },
    },
    base: './',
    build: {
      // Nombres fijos SIN hash — requerido para APEX Static Files (referencia por nombre exacto)
      rollupOptions: {
        output: {
          entryFileNames: 'assets/[name].js',
          chunkFileNames: 'assets/[name].js',
          assetFileNames: 'assets/[name].[ext]',
        },
      },
      sourcemap: mode !== 'apex',
    },
  }
})
