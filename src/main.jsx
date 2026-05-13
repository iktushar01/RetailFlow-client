import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router-dom'
import router from './Routes/PublicRoute.jsx'
import { AuthProvider } from './contexts/AuthContext'
import { ThemeProvider } from './providers/theme-provider.jsx'
import { Toaster } from "@/components/ui/sonner"

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <RouterProvider router={router} />
        <Toaster richColors closeButton position="top-right" />
      </ThemeProvider>
    </AuthProvider>
  </StrictMode>,
)