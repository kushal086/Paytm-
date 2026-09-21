import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // Relative so the build also works when served from a nested path
  // (static hosts, previews) rather than only from the domain root.
  base: './',
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
  },
})
