import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: parseInt(process.env.VITE_PORT || '5173'),
    strictPort: true,
    // allow the frontend domain with traefik reverse proxy
    allowedHosts: process.env.FRONTEND_DOMAIN 
      ? [process.env.FRONTEND_DOMAIN, 'localhost']
      : ['spotifew.4pp.duckdns.org', '4pp.duckdns.org', 'localhost'],
  },
})
