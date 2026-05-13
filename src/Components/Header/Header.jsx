import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Menu, Search, Bell, User, Settings, LogOut, ChevronDown } from 'lucide-react'
import { Z_INDEX } from '../../constants/zIndex'
import { dashboardAPI } from '../../Pages/HomePage/services/dashboardService'
import { useAuth } from '../../contexts/AuthContext'
import Swal from 'sweetalert2'
import { ModeToggle } from '@/Shared/ModeToggle'

const Header = ({ onMenuClick, onSidebarCollapse, isSidebarCollapsed }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuth()
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [notificationCount, setNotificationCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())
  const userMenuRef = useRef(null)

  useEffect(() => { fetchNotificationCount() }, [])

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setShowUserMenu(false)
      }
    }
    if (showUserMenu) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showUserMenu])

  const fetchNotificationCount = async () => {
    try {
      setLoading(true)
      const alerts = await dashboardAPI.getAlerts()
      setNotificationCount(alerts.length)
    } catch {
      setNotificationCount(0)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    Swal.fire({
      title: 'Sign out',
      text: 'Are you sure you want to sign out?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#6366f1',
      cancelButtonColor: '#334155',
      confirmButtonText: 'Yes, sign out',
      background: 'var(--popover)',
      color: 'var(--popover-foreground)',
    }).then((result) => {
      if (result.isConfirmed) {
        logout()
        navigate('/login')
      }
    })
  }

  const getPageTitle = () => {
    const path = location.pathname
    const map = [
      ['/dashboard/overview', 'Overview'],
      ['/dashboard/notifications', 'Notifications'],
      ['/profile', 'Profile'],
      ['/settings', 'Settings'],
      ['/suppliers', 'Suppliers'],
      ['/products', 'Products'],
      ['/warehouse', 'Warehouse'],
      ['/sales', 'Sales & POS'],
      ['/inventory', 'Inventory & Reports'],
    ]
    for (const [prefix, label] of map) {
      if (path === prefix || path.startsWith(prefix + '/')) return label
    }
    return 'Dashboard'
  }

  const getBreadcrumb = () =>
    location.pathname.split('/').filter(Boolean).map(p => p.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()))

  const formatTime = (date) => date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })
  const formatDate = (date) => date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })

  const userInitials = (user?.name || 'Admin').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()

  return (
    <>
      <style>{`
        .hdr-root {
          background: var(--background);
          border-bottom: 1px solid var(--border);
          font-family: var(--font-sans, 'DM Sans', sans-serif);
        }
        .hdr-hamburger {
          width: 36px; height: 36px;
          display: flex; align-items: center; justify-content: center;
          border-radius: 8px; border: 1px solid var(--border);
          background: var(--secondary); color: var(--muted-foreground);
          cursor: pointer; transition: all 0.15s;
        }
        .hdr-hamburger:hover { background: var(--accent); color: var(--accent-foreground); }
        
        .hdr-search-wrap { position: relative; }
        .hdr-search-input {
          background: var(--secondary); border: 1px solid var(--border);
          border-radius: 8px; padding: 7px 12px 7px 36px;
          font-size: 13px; color: var(--foreground); width: 200px;
          outline: none; transition: all 0.15s;
        }

        .hdr-clock {
          display: flex; align-items: center; gap: 8px;
          background: var(--secondary); border: 1px solid var(--border);
          border-radius: 8px; padding: 4px 10px;
        }
        .hdr-clock-time { font-size: 12px; font-weight: 600; font-family: 'DM Mono', monospace; }

        .hdr-notif-btn {
          position: relative; width: 36px; height: 36px;
          border-radius: 8px; background: var(--secondary);
          border: 1px solid var(--border); display: flex;
          align-items: center; justify-content: center;
          color: var(--muted-foreground); cursor: pointer;
        }

        .hdr-user-trigger {
          display: flex; align-items: center; gap: 8px;
          padding: 4px; border-radius: 10px;
          border: 1px solid var(--border); background: var(--secondary);
          cursor: pointer;
        }
        .hdr-user-avatar {
          width: 28px; height: 28px; border-radius: 6px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          display: flex; align-items: center; justify-content: center;
          color: white; font-size: 11px; font-weight: 700;
        }

        .hdr-dropdown {
          position: absolute; right: 0; top: calc(100% + 8px);
          width: 220px; background: var(--popover);
          border: 1px solid var(--border); border-radius: 12px;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }

        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>

      <header className="hdr-root px-4 py-2.5 sticky top-0 z-50">
        <div className="flex items-center justify-between">
          
          {/* LEFT: Hamburger & Title */}
          <div className="flex items-center gap-3">
            <button 
              className="hdr-hamburger" 
              onClick={() => { onMenuClick?.(); onSidebarCollapse?.(); }}
            >
              <Menu size={18} />
            </button>
            
            <div className="hidden sm:block">
              <h1 className="text-sm font-bold text-foreground leading-none">{getPageTitle()}</h1>
              <div className="flex items-center gap-1 mt-1">
                {getBreadcrumb().slice(-1).map((crumb, i) => (
                  <span key={i} className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">{crumb}</span>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT: Responsive Actions */}
          <div className="flex items-center gap-2">
            
            {/* Desktop Only: Search & Clock */}
            <div className="hidden lg:flex items-center gap-3 mr-2">
              <div className="hdr-search-wrap">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input type="text" placeholder="Search..." className="hdr-search-input" />
              </div>
              
              <div className="hdr-clock">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                <span className="hdr-clock-time text-foreground">{formatTime(currentTime)}</span>
              </div>
            </div>

            {/* Always Visible: Theme Toggle */}
            <ModeToggle />

            {/* Mobile/Tablet Hide: Notifications (keeps UI clean on small phns) */}
            <button className="hdr-notif-btn hidden xs:flex" onClick={() => navigate('/dashboard/notifications')}>
              <Bell size={16} />
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-white border-2 border-background">
                  {notificationCount > 99 ? '99+' : notificationCount}
                </span>
              )}
            </button>

            {/* Always Visible: User Menu */}
            <div className="relative" ref={userMenuRef}>
              <button className="hdr-user-trigger" onClick={() => setShowUserMenu(!showUserMenu)}>
                <div className="hdr-user-avatar">{userInitials}</div>
                <ChevronDown size={12} className="text-muted-foreground ml-0.5" />
              </button>

              {showUserMenu && (
                <div className="hdr-dropdown" style={{ zIndex: Z_INDEX.DROPDOWN }}>
                  <div className="p-3 border-bottom border-border bg-muted/30">
                    <p className="text-xs font-bold text-foreground">{user?.name || 'Admin'}</p>
                    <p className="text-[10px] text-muted-foreground truncate">{user?.email || 'admin@store.com'}</p>
                  </div>
                  <div className="p-1">
                    <button className="flex w-full items-center gap-2 px-3 py-2 text-xs text-muted-foreground hover:bg-accent hover:text-accent-foreground rounded-md transition-colors" onClick={() => { setShowUserMenu(false); navigate('/profile'); }}>
                      <User size={14} /> Profile
                    </button>
                    <button className="flex w-full items-center gap-2 px-3 py-2 text-xs text-destructive hover:bg-destructive/10 rounded-md transition-colors" onClick={handleLogout}>
                      <LogOut size={14} /> Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </header>
    </>
  )
}

export default Header
