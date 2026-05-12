import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Menu, Search, Bell, User, Settings, LogOut, ChevronDown } from 'lucide-react'
import { Z_INDEX } from '../../constants/zIndex'
import { dashboardAPI } from '../../Pages/HomePage/services/dashboardService'
import { useAuth } from '../../contexts/AuthContext'
import Swal from 'sweetalert2'
import { ModeToggle } from '@/Shared/ModeToggle'

/**
 * Header props:
 *  onMenuClick        – called on mobile (≤768px) to open the mobile drawer
 *  onSidebarCollapse  – called on ALL devices to toggle icon-only collapse
 *  isSidebarCollapsed – current collapsed state (used for aria / icon)
 *
 * One hamburger button handles both behaviours:
 *   • On small screens  → opens/closes the mobile overlay drawer
 *   • On medium+ screens → collapses/expands the sidebar to icon-only mode
 */
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

  const handleNotificationClick = () => navigate('/dashboard/notifications')

  const handleLogout = () => {
    Swal.fire({
      title: 'Sign out',
      text: 'Are you sure you want to sign out?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#6366f1',
      cancelButtonColor: '#334155',
      confirmButtonText: 'Yes, sign out',
      cancelButtonText: 'Cancel',
      background: 'var(--popover)',
      color: 'var(--popover-foreground)',
    }).then((result) => {
      if (result.isConfirmed) {
        logout()
        navigate('/login')
        Swal.fire({
          icon: 'success',
          title: 'Signed out',
          text: 'You have been signed out successfully.',
          timer: 1500,
          showConfirmButton: false,
          background: 'var(--popover)',
          color: 'var(--popover-foreground)',
        })
      }
    })
  }

  const handleProfileClick = () => { setShowUserMenu(false); navigate('/profile') }
  const handleSettingsClick = () => { setShowUserMenu(false); navigate('/settings') }

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
    location.pathname
      .split('/')
      .filter(Boolean)
      .map(p => p.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()))

  const formatTime = (date) =>
    date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })

  const formatDate = (date) =>
    date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })

  const userInitials = (user?.name || 'Admin')
    .split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()

  const handleHamburgerClick = () => {
    // On mobile: open drawer | On desktop: collapse sidebar
    onMenuClick?.()
    onSidebarCollapse?.()
  }

  return (
    <>
      <style>{`
        /* ── All colours come from index.css CSS variables ── */
        .hdr-root {
          background: var(--background);
          border-bottom: 1px solid var(--border);
          font-family: var(--font-sans, 'DM Sans', sans-serif);
        }

        /* Hamburger – single button, works on ALL screen sizes */
        .hdr-hamburger {
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          border: 1px solid var(--border);
          background: var(--secondary);
          color: var(--muted-foreground);
          cursor: pointer;
          transition: background 0.15s, color 0.15s, border-color 0.15s;
          flex-shrink: 0;
        }
        .hdr-hamburger:hover {
          background: var(--accent);
          color: var(--accent-foreground);
          border-color: var(--input);
        }

        /* Search */
        .hdr-search-wrap { position: relative; }
        .hdr-search-input {
          background: var(--secondary);
          border: 1px solid var(--border);
          border-radius: 8px;
          padding: 7px 12px 7px 36px;
          font-size: 13px;
          color: var(--foreground);
          width: 220px;
          outline: none;
          transition: border-color 0.15s, box-shadow 0.15s, background 0.15s;
          font-family: inherit;
        }
        .hdr-search-input::placeholder { color: var(--muted-foreground); }
        .hdr-search-input:focus {
          border-color: var(--ring);
          background: var(--background);
          box-shadow: 0 0 0 3px color-mix(in oklch, var(--ring) 20%, transparent);
        }
        .hdr-search-icon {
          position: absolute;
          left: 10px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--muted-foreground);
          pointer-events: none;
        }

        /* Clock chip */
        .hdr-clock {
          display: flex;
          align-items: center;
          gap: 8px;
          background: var(--secondary);
          border: 1px solid var(--border);
          border-radius: 8px;
          padding: 6px 12px;
        }
        .hdr-clock-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #22c55e;
          animation: hdrPulse 2s ease-in-out infinite;
          flex-shrink: 0;
        }
        @keyframes hdrPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.4; transform: scale(0.8); }
        }
        .hdr-clock-time {
          font-size: 13px;
          font-weight: 600;
          color: var(--foreground);
          font-family: 'DM Mono', monospace;
          letter-spacing: 0.02em;
        }
        .hdr-clock-date {
          font-size: 11px;
          color: var(--muted-foreground);
          font-weight: 500;
        }

        /* Notification button */
        .hdr-notif-btn {
          position: relative;
          width: 36px;
          height: 36px;
          border-radius: 8px;
          background: var(--secondary);
          border: 1px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--muted-foreground);
          cursor: pointer;
          transition: background 0.15s, border-color 0.15s, color 0.15s;
        }
        .hdr-notif-btn:hover {
          background: var(--accent);
          color: var(--accent-foreground);
          border-color: var(--input);
        }
        .hdr-notif-badge {
          position: absolute;
          top: -4px;
          right: -4px;
          min-width: 18px;
          height: 18px;
          background: var(--destructive);
          color: white;
          font-size: 10px;
          font-weight: 700;
          border-radius: 99px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 4px;
          border: 2px solid var(--background);
        }

        /* User trigger */
        .hdr-user-trigger {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 4px 8px 4px 4px;
          border-radius: 10px;
          border: 1px solid var(--border);
          background: var(--secondary);
          cursor: pointer;
          transition: background 0.15s, border-color 0.15s;
        }
        .hdr-user-trigger:hover {
          background: var(--accent);
          border-color: var(--input);
        }
        .hdr-user-avatar {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.02em;
          flex-shrink: 0;
        }
        .hdr-user-name {
          font-size: 13px;
          font-weight: 600;
          color: var(--foreground);
          max-width: 100px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        /* Dropdown panel */
        .hdr-dropdown {
          position: absolute;
          right: 0;
          top: calc(100% + 8px);
          width: 224px;
          background: var(--popover);
          border: 1px solid var(--border);
          border-radius: 12px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.15), 0 2px 8px rgba(0,0,0,0.08);
          overflow: hidden;
          animation: hdrDropIn 0.15s ease-out;
        }
        @keyframes hdrDropIn {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .hdr-dropdown-header {
          padding: 12px 14px 10px;
          border-bottom: 1px solid var(--border);
        }
        .hdr-dd-name {
          font-size: 13.5px;
          font-weight: 700;
          color: var(--popover-foreground);
        }
        .hdr-dd-email {
          font-size: 11.5px;
          color: var(--muted-foreground);
          margin-top: 1px;
        }
        .hdr-dd-role {
          display: inline-block;
          margin-top: 5px;
          font-size: 10.5px;
          font-weight: 600;
          color: #6366f1;
          background: rgba(99,102,241,0.1);
          border-radius: 4px;
          padding: 1px 7px;
          letter-spacing: 0.03em;
        }
        .hdr-dd-item {
          display: flex;
          align-items: center;
          gap: 10px;
          width: 100%;
          padding: 9px 14px;
          font-size: 13px;
          font-weight: 500;
          color: var(--muted-foreground);
          background: none;
          border: none;
          cursor: pointer;
          text-align: left;
          transition: background 0.12s, color 0.12s;
          font-family: inherit;
        }
        .hdr-dd-item:hover {
          background: var(--accent);
          color: var(--accent-foreground);
        }
        .hdr-dd-item.danger { color: var(--destructive); }
        .hdr-dd-item.danger:hover {
          background: color-mix(in oklch, var(--destructive) 10%, transparent);
          color: var(--destructive);
        }
        .hdr-dd-divider {
          height: 1px;
          background: var(--border);
          margin: 2px 0;
        }

        /* Page title / breadcrumb */
        .hdr-page-title {
          font-size: 17px;
          font-weight: 700;
          color: var(--foreground);
          letter-spacing: -0.02em;
          font-family: var(--font-sans, 'DM Sans', sans-serif);
          line-height: 1.2;
        }
        .hdr-breadcrumb {
          display: flex;
          align-items: center;
          gap: 4px;
          margin-top: 1px;
        }
        .hdr-bc-item {
          font-size: 11.5px;
          color: var(--muted-foreground);
          font-weight: 500;
        }
        .hdr-bc-sep {
          font-size: 11px;
          color: var(--border);
        }
      `}</style>

      <header className="hdr-root px-5 py-3 relative">
        <div className="flex items-center justify-between gap-4">

          {/* ── Left: hamburger + page title ── */}
          <div className="flex items-center gap-3">
            {/* Single hamburger for ALL devices */}
            <button
              className="hdr-hamburger"
              onClick={handleHamburgerClick}
              title="Menu"
              aria-label="Toggle menu"
            >
              <Menu size={18} />
            </button>

            <div>
              <div className="hdr-page-title">{getPageTitle()}</div>
              <div className="hdr-breadcrumb">
                {getBreadcrumb().map((crumb, i, arr) => (
                  <React.Fragment key={i}>
                    <span className="hdr-bc-item">{crumb}</span>
                    {i < arr.length - 1 && <span className="hdr-bc-sep">/</span>}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>

          {/* ── Right: search, clock, mode toggle, notifications, user ── */}
          <div className="flex items-center gap-2.5">
            {/* Search */}
            <div className="hidden md:block hdr-search-wrap">
              <Search size={14} className="hdr-search-icon" />
              <input
                type="text"
                placeholder="Search anything..."
                className="hdr-search-input"
              />
            </div>

            {/* Clock */}
            <div className="hidden lg:flex hdr-clock">
              <div className="hdr-clock-dot" />
              <div className="flex flex-col">
                <span className="hdr-clock-time">{formatTime(currentTime)}</span>
                <span className="hdr-clock-date">{formatDate(currentTime)}</span>
              </div>
            </div>

            {/* Dark / Light toggle (from shadcn) */}
            <ModeToggle />

            {/* Notifications */}
            <button
              className="hdr-notif-btn"
              onClick={handleNotificationClick}
              title="Notifications"
              aria-label="View notifications"
            >
              <Bell size={16} />
              {notificationCount > 0 && (
                <span className="hdr-notif-badge">
                  {notificationCount > 99 ? '99+' : notificationCount}
                </span>
              )}
              {loading && (
                <span className="hdr-notif-badge" style={{ background: '#6366f1' }}>
                  <span style={{
                    display: 'block', width: 8, height: 8,
                    border: '1.5px solid rgba(255,255,255,0.4)',
                    borderTopColor: '#fff', borderRadius: '50%',
                    animation: 'spin 0.7s linear infinite'
                  }} />
                </span>
              )}
            </button>

            {/* User menu */}
            <div className="relative" ref={userMenuRef}>
              <button
                className="hdr-user-trigger"
                onClick={() => setShowUserMenu(v => !v)}
                aria-haspopup="true"
                aria-expanded={showUserMenu}
              >
                <div className="hdr-user-avatar">{userInitials}</div>
                <span className="hdr-user-name hidden md:block">{user?.name || 'Admin'}</span>
                <ChevronDown size={13} style={{ color: 'var(--muted-foreground)', flexShrink: 0 }} />
              </button>

              {showUserMenu && (
                <div className="hdr-dropdown" style={{ zIndex: Z_INDEX.DROPDOWN }}>
                  <div className="hdr-dropdown-header">
                    <div className="hdr-dd-name">{user?.name || 'Admin User'}</div>
                    <div className="hdr-dd-email">{user?.email || 'admin@store-xen.com'}</div>
                    <span className="hdr-dd-role">{user?.role || 'Administrator'}</span>
                  </div>
                  <div className="py-1">
                    <button className="hdr-dd-item" onClick={handleProfileClick}>
                      <User size={15} /> Profile
                    </button>
                    <button className="hdr-dd-item" onClick={handleSettingsClick}>
                      <Settings size={15} /> Settings
                    </button>
                    <div className="hdr-dd-divider" />
                    <button className="hdr-dd-item danger" onClick={handleLogout}>
                      <LogOut size={15} /> Sign out
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