import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from "path"
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const API_TARGET = 'http://localhost:5000'

/** Backend paths proxied in dev so auth cookies stay same-origin (localhost:5173). */
const PROXY_PATHS = [
  '/api',
  '/products',
  '/suppliers',
  '/purchase-orders',
  '/grn',
  '/inventory',
  '/payments',
  '/warehouses',
  '/stock-transfers',
  '/sales',
  '/customers',
  '/discounts',
  '/sales-payments',
  '/returns',
  '/upload',
  '/ai',
  '/batches',
]

const devProxy = Object.fromEntries(
  PROXY_PATHS.map((route) => [
    route,
    { target: API_TARGET, changeOrigin: true, secure: false },
  ])
)

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: devProxy,
  },
})
