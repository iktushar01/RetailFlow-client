import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { LogIn, Lock, User, Eye, EyeOff, AlertCircle, Info, Loader2 } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'

// Shadcn UI Components
import { Button } from "@/Components/UI/button"
import { Input } from "@/Components/UI/input"
import { Label } from "@/Components/UI/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/Components/UI/card"
import { Alert, AlertDescription, AlertTitle } from "@/Components/UI/alert"

const LoginPage = () => {
  const navigate = useNavigate()
  const { login, isAuthenticated } = useAuth()
  
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isAuthenticated()) {
      navigate('/dashboard/overview')
    }
  }, [isAuthenticated, navigate])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (error) setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const result = await login(formData.email, formData.password)
      if (result.success) {
        setTimeout(() => navigate('/dashboard/overview'), 300)
      } else {
        setError(result.error || 'Invalid credentials')
      }
    } catch (err) {
      setError('Connection error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const fillDemoCredentials = () => {
    setFormData({ email: 'admin@retailflow.local', password: 'admin123' })
    setError('')
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 selection:bg-primary/20">
      <div className="max-w-md w-full space-y-8 animate-in fade-in zoom-in-95 duration-500">
        
        {/* Branding */}
        <div className="text-center space-y-2">
          <div className="mx-auto w-14 h-14 bg-primary rounded-2xl flex items-center justify-center shadow-xl shadow-primary/20 mb-4">
            <LogIn className="w-7 h-7 text-primary-foreground" />
          </div>
          <h1 className="text-4xl font-black tracking-tight text-foreground">
            Retail<span className="text-primary">Flow</span>
          </h1>
          <p className="text-muted-foreground font-medium">Enterprise Management Suite</p>
        </div>

        <Card className="border-border shadow-2xl bg-card/50 backdrop-blur-sm">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">Sign In</CardTitle>
            <CardDescription>Enter your credentials to access your dashboard</CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Error Message */}
            {error && (
              <Alert variant="destructive" className="animate-in slide-in-from-top-2">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Demo Credentials Alert */}
            <Alert className="bg-muted/50 border-primary/20">
              <Info className="h-4 w-4 text-primary" />
              <AlertTitle className="text-xs uppercase tracking-widest font-bold opacity-70">Quick Access</AlertTitle>
              <AlertDescription className="mt-2">
                <div className="flex flex-col gap-1 text-xs font-mono">
                  <div className="flex justify-between"><span>Email:</span> <span className="font-bold text-primary">admin@retailflow.local</span></div>
                  <div className="flex justify-between"><span>Pass:</span> <span className="font-bold text-primary">admin123</span></div>
                </div>
                <p className="text-[10px] text-muted-foreground mt-2">Set VITE_BYPASS_AUTH=true for offline dev login, or register via API.</p>
                <Button 
                  variant="link" 
                  size="sm" 
                  onClick={fillDemoCredentials}
                  className="h-auto p-0 mt-2 text-primary hover:no-underline font-bold"
                >
                  Auto-fill Demo Details
                </Button>
              </AlertDescription>
            </Alert>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="admin@store.com"
                    className="pl-10"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={loading}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    className="pl-10 pr-10"
                    value={formData.password}
                    onChange={handleChange}
                    disabled={loading}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button type="submit" className="w-full h-11 text-base font-bold shadow-lg shadow-primary/20" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Authenticating...
                  </>
                ) : (
                  <>
                    <LogIn className="mr-2 h-4 w-4" />
                    Sign In
                  </>
                )}
              </Button>
              {loading && (
                <div className="rounded-lg border border-primary/20 bg-primary/5 p-3 text-center animate-in fade-in slide-in-from-top-1">
                  <p className="text-sm font-semibold text-foreground">
                    First load may take up to 45 seconds
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    The server is waking up. On the free Render plan this can take up to 45 seconds on the first visit after idle time. Please wait and do not refresh.
                  </p>
                </div>
              )}
            </form>
          </CardContent>
          
          <CardFooter>
            <p className="w-full text-center text-xs text-muted-foreground">
              Secure SSL Encrypted Environment
            </p>
          </CardFooter>
        </Card>

        <p className="text-center text-xs text-muted-foreground/60 font-medium">
          &copy; {new Date().getFullYear()} RetailFlow Systems • v2.4.0
        </p>
      </div>
    </div>
  )
}

export default LoginPage

