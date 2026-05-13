import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: ['ocelot-equal-hunting.ngrok-free.dev'],
    proxy: {
      '/proxy': {
        target: 'https://stagingapi.surveybooker.co.uk',
        changeOrigin: true,  // ← spoofs Origin automatically
        rewrite: (path) => path.replace(/^\/proxy/, ''),
        headers: {
          'Referer': 'https://stagingsandbox.surveybooker.co.uk/',
          'Origin': 'https://stagingsandbox.surveybooker.co.uk',
        }
      }
    }
  }
})