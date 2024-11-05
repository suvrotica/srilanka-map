import { defineConfig, loadEnv } from 'vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
    define: {
      GOOGLE_MAPS_API_KEY: JSON.stringify(env.VITE_GOOGLE_MAPS_API_KEY)
    },
    server: {
      port: 3000
    },
    build: {
      sourcemap: true,
      rollupOptions: {
        output: {
          manualChunks: undefined
        }
      }
    }
  }
})