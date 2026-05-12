import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router-dom'
import router from './Routes/PublicRoute.jsx'
import { AuthProvider } from './contexts/AuthContext'
import { ThemeProvider } from './providers/theme-provider.jsx'

// Import the shadcn toaster (Sonner is recommended for shadcn/ui)
import { Toaster } from "@/components/ui/sonner" 
// Or if you are using the standard toast: import { Toaster } from "@/components/ui/toaster"

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <RouterProvider router={router} />
        {/* Render the Toaster here so it's available globally */}
        <Toaster richColors closeButton position="top-right" />
      </ThemeProvider>
    </AuthProvider>
  </StrictMode>,
)