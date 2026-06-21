import React, { useState } from 'react'
import {
  User,
  Mail,
  Briefcase,
  Clock,
  Calendar,
  Save,
  Edit2,
  ShieldCheck,
  X,
  Camera
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import Swal from 'sweetalert2'
import { Button } from '../../Components/UI/button'
import { cn } from "@/lib/utils"

const ProfilePage = () => {
  const { user, updateUser } = useAuth()
  const [isEditing, setIsEditing] = useState(false)

  const initialFormState = {
    name: user?.name || '',
    email: user?.email || '',
    role: user?.role || ''
  }

  const [formData, setFormData] = useState(initialFormState)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    updateUser(formData)
    setIsEditing(false)
    Swal.fire({
      icon: 'success',
      title: 'Success!',
      text: 'Profile configuration updated.',
      confirmButtonColor: 'oklch(var(--primary))'
    })
  }

  const handleCancel = () => {
    setFormData(initialFormState)
    setIsEditing(false)
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    })
  }

  const InputField = ({ label, icon: Icon, name, type = "text", disabled = false, placeholder }) => (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-muted-foreground">
        {label}
      </label>
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
          <Icon className={cn(
            "h-4 w-4 transition-colors",
            isEditing && !disabled ? "text-primary" : "text-muted-foreground/50"
          )} />
        </div>
        <input
          type={type}
          name={name}
          value={formData[name]}
          onChange={handleChange}
          disabled={!isEditing || disabled}
          placeholder={placeholder}
          className={cn(
            "block w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border transition-all duration-200",
            isEditing && !disabled
              ? "bg-background border-primary/30 ring-2 ring-primary/5 focus:ring-primary/20 focus:border-primary outline-none"
              : "bg-muted/30 border-transparent text-foreground cursor-not-allowed"
          )}
        />
      </div>
    </div>
  )

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12 animate-in fade-in duration-500">
      {/* Dynamic Hero Section */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between border-b pb-6">
        <div className="space-y-1.5">
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            {user?.name || 'Profile'}
          </h1>
          <p className="text-muted-foreground text-sm md:text-base">
            {user?.email || user?.username}
          </p>
        </div>
        <div className="shrink-0">
            {!isEditing ? (
              <Button onClick={() => setIsEditing(true)} variant="outline" className="gap-2 rounded-xl">
                <Edit2 className="w-4 h-4" /> Edit Profile
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button onClick={handleCancel} variant="ghost" className="h-10 w-10 p-0 rounded-xl">
                  <X className="w-4 h-4" />
                </Button>
                <Button onClick={handleSubmit} className="gap-2 rounded-xl px-6">
                  <Save className="w-4 h-4" /> Save
                </Button>
              </div>
            )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Details Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card border rounded-3xl p-8 shadow-sm">
            <div className="flex items-center gap-2 mb-8">
              <ShieldCheck className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-base">Account Details</h3>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  label="Display Name"
                  icon={User}
                  name="name"
                  placeholder="Operational Handle"
                />
                <InputField
                  label="Email Link"
                  icon={Mail}
                  name="email"
                  type="email"
                  placeholder="contact@system.com"
                />
                <InputField
                  label="System Role"
                  icon={Briefcase}
                  name="role"
                  disabled
                />
              </div>
            </form>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <div className="bg-card border rounded-3xl p-6 shadow-sm">
            <h4 className="font-bold text-[11px] uppercase tracking-widest text-muted-foreground mb-6">
              Activity Metrics
            </h4>

            <div className="space-y-5">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-muted rounded-lg shrink-0">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-tighter">Username ID</p>
                  <p className="text-sm font-mono">{user?.username}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2 bg-muted rounded-lg shrink-0">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-tighter">Access Log</p>
                  <p className="text-sm">{formatDate(user?.loginTime)}</p>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-dashed">
                <div className="flex items-center gap-2 text-[10px] text-green-600 font-bold uppercase">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                  Account Status: Active
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
