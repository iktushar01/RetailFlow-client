import React, { useState } from 'react'
import { 
  Settings, 
  Lock, 
  Bell, 
  Globe, 
  Moon, 
  Monitor,
  Save,
  AlertCircle,
  Shield,
  Palette,
  Languages,
  Clock,
  Eye
} from 'lucide-react'
import Swal from 'sweetalert2'
import { Button } from '../../Components/UI/Button'
import { cn } from "@/lib/utils"

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('general')
  const [settings, setSettings] = useState({
    language: 'en',
    timezone: 'UTC+6',
    dateFormat: 'MM/DD/YYYY',
    currency: 'BDT',
    emailNotifications: true,
    pushNotifications: false,
    lowStockAlerts: true,
    salesNotifications: true,
    theme: 'light',
    compactMode: false,
    showTooltips: true,
    sessionTimeout: '30',
    twoFactorAuth: false
  })

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const tabs = [
    { id: 'general', label: 'General', icon: Globe },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'display', label: 'Appearance', icon: Palette },
    { id: 'security', label: 'Security', icon: Shield },
  ]

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  const handleSaveSettings = () => {
    localStorage.setItem('appSettings', JSON.stringify(settings))
    Swal.fire({
      icon: 'success',
      title: 'Configuration Updated',
      text: 'Global preferences have been synchronized.',
      confirmButtonColor: 'oklch(var(--primary))'
    })
  }

  const handlePasswordSubmit = (e) => {
    e.preventDefault()
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      Swal.fire({ icon: 'error', title: 'Mismatch', text: 'Passwords do not match.' })
      return
    }
    Swal.fire({ icon: 'success', title: 'Secure', text: 'Password updated successfully.' })
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
  }

  // Sub-component for Toggle Switches
  const Toggle = ({ enabled, onChange, label, description }) => (
    <div className="flex items-center justify-between py-4 group">
      <div className="space-y-0.5">
        <p className="text-sm font-bold text-foreground uppercase tracking-tight">{label}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <button
        onClick={onChange}
        className={cn(
          "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ring-offset-background",
          enabled ? "bg-primary" : "bg-muted"
        )}
      >
        <span className={cn(
          "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200",
          enabled ? "translate-x-5" : "translate-x-0"
        )} />
      </button>
    </div>
  )

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-10 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="relative overflow-hidden bg-card border rounded-3xl p-8 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-2xl">
              <Settings className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tighter text-foreground uppercase italic leading-none">
                System <span className="text-primary/70">Preferences</span>
              </h1>
              <p className="text-muted-foreground text-xs mt-1 font-medium tracking-wide uppercase">
                Configure your environment and security protocols
              </p>
            </div>
          </div>
          <Button onClick={handleSaveSettings} className="gap-2 px-8 rounded-xl shadow-lg shadow-primary/20">
            <Save className="w-4 h-4" /> Save Changes
          </Button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Navigation Sidebar */}
        <aside className="lg:w-64 shrink-0">
          <nav className="flex lg:flex-col gap-2 bg-muted/30 p-2 rounded-2xl border">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all uppercase tracking-tighter",
                  activeTab === tab.id 
                    ? "bg-card text-primary shadow-sm border border-primary/10" 
                    : "text-muted-foreground hover:bg-card/50 hover:text-foreground"
                )}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Content Area */}
        <main className="flex-1 min-h-[500px]">
          <div className="bg-card border rounded-3xl p-8 shadow-sm h-full">
            
            {activeTab === 'general' && (
              <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-primary tracking-[0.2em] ml-1">Locale & Language</label>
                    <div className="relative">
                      <Languages className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                      <select 
                        value={settings.language}
                        onChange={(e) => handleSettingChange('language', e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-muted/20 border rounded-xl focus:ring-2 ring-primary/20 outline-none appearance-none font-medium text-sm"
                      >
                        <option value="en">English (Global)</option>
                        <option value="bn">Bengali (বাংলা)</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-primary tracking-[0.2em] ml-1">Timezone Engine</label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                      <select 
                        value={settings.timezone}
                        onChange={(e) => handleSettingChange('timezone', e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-muted/20 border rounded-xl focus:ring-2 ring-primary/20 outline-none appearance-none font-medium text-sm"
                      >
                        <option value="UTC+6">UTC+6 (Dhaka)</option>
                        <option value="UTC+0">UTC+0 (London)</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="divide-y border-t animate-in slide-in-from-right-4 duration-300">
                <Toggle 
                  label="Inventory Alerts" 
                  description="Real-time notification when SKUs drop below threshold"
                  enabled={settings.lowStockAlerts}
                  onChange={() => handleSettingChange('lowStockAlerts', !settings.lowStockAlerts)}
                />
                <Toggle 
                  label="Sales Reporting" 
                  description="Summarized daily reports of all finalized transactions"
                  enabled={settings.salesNotifications}
                  onChange={() => handleSettingChange('salesNotifications', !settings.salesNotifications)}
                />
                <Toggle 
                  label="Push Protocol" 
                  description="Enable native browser desktop notifications"
                  enabled={settings.pushNotifications}
                  onChange={() => handleSettingChange('pushNotifications', !settings.pushNotifications)}
                />
              </div>
            )}

            {activeTab === 'display' && (
              <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
                 <div className="grid grid-cols-3 gap-4">
                    {['light', 'dark', 'auto'].map((t) => (
                      <button 
                        key={t}
                        onClick={() => handleSettingChange('theme', t)}
                        className={cn(
                          "p-4 rounded-2xl border-2 flex flex-col items-center gap-3 transition-all",
                          settings.theme === t ? "border-primary bg-primary/5" : "border-transparent bg-muted/30 hover:bg-muted/50"
                        )}
                      >
                        {t === 'dark' ? <Moon className="w-5 h-5" /> : t === 'light' ? <Monitor className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        <span className="text-[10px] font-bold uppercase tracking-widest">{t}</span>
                      </button>
                    ))}
                 </div>
                 <Toggle 
                  label="Compact View" 
                  description="Optimize layout for high-density information displays"
                  enabled={settings.compactMode}
                  onChange={() => handleSettingChange('compactMode', !settings.compactMode)}
                />
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
                <div className="bg-destructive/5 border border-destructive/10 p-4 rounded-2xl flex gap-4">
                  <AlertCircle className="w-5 h-5 text-destructive shrink-0" />
                  <p className="text-xs text-destructive/80 font-medium">Changing your password will terminate all active sessions across other devices.</p>
                </div>
                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                   <input 
                      type="password" 
                      placeholder="Current Security Key"
                      className="w-full px-4 py-2.5 bg-muted/20 border rounded-xl outline-none focus:ring-2 ring-primary/20 text-sm"
                   />
                   <div className="grid grid-cols-2 gap-4">
                    <input 
                        type="password" 
                        placeholder="New Password"
                        className="w-full px-4 py-2.5 bg-muted/20 border rounded-xl outline-none focus:ring-2 ring-primary/20 text-sm"
                    />
                    <input 
                        type="password" 
                        placeholder="Confirm New Password"
                        className="w-full px-4 py-2.5 bg-muted/20 border rounded-xl outline-none focus:ring-2 ring-primary/20 text-sm"
                    />
                   </div>
                   <Button variant="outline" className="w-full rounded-xl border-destructive/20 text-destructive hover:bg-destructive/5">Update Credentials</Button>
                </form>
              </div>
            )}

          </div>
        </main>
      </div>
    </div>
  )
}

export default SettingsPage