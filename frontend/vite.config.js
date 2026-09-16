import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    target: ['safari13', 'ios13', 'chrome89', 'edge89', 'firefox89'],
    cssTarget: ['safari13', 'ios13', 'chrome89', 'edge89', 'firefox89'],
  },
})
