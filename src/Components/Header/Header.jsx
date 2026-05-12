import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Menu, Search, Bell, User, Settings, LogOut, Clock, ChevronDown } from 'lucide-react'
import { Z_INDEX } from '../../constants/zIndex'
import { dashboardAPI } from '../../Pages/HomePage/services/dashboardService'
import { useAuth } from '../../contexts/AuthContext'
import Swal from 'sweetalert2'

const Header = ({ onMenuClick }) => {
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
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
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
      background: '#0f1117',
      color: '#e2e8f0'
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
          background: '#0f1117',
          color: '#e2e8f0'
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

  const getBreadcrumb = () => {
    const path = location.pathname
    const parts = path.split('/').filter(Boolean)
    return parts.map(p => p.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()))
  }

  const formatTime = (date) =>
    date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })

  const formatDate = (date) =>
    date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })

  const userInitials = (user?.name || 'Admin').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()

  return (
    <>
      <style>{`
        .header-root {
          background: #ffffff;
          border-bottom: 1px solid #f1f5f9;
          font-family: 'DM Sans', 'Inter', sans-serif;
        }
        .header-search-wrap {
          position: relative;
        }
        .header-search-input {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 7px 12px 7px 36px;
          font-size: 13px;
          color: #334155;
          width: 220px;
          outline: none;
          transition: border-color 0.15s, box-shadow 0.15s, background 0.15s;
          font-family: inherit;
        }
        .header-search-input::placeholder { color: #94a3b8; }
        .header-search-input:focus {
          border-color: #6366f1;
          background: #fff;
          box-shadow: 0 0 0 3px rgba(99,102,241,0.08);
        }
        .header-search-icon {
          position: absolute;
          left: 10px;
          top: 50%;
          transform: translateY(-50%);
          color: #94a3b8;
          pointer-events: none;
        }
        .clock-chip {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 6px 12px;
        }
        .clock-time {
          font-size: 13px;
          font-weight: 600;
          color: #1e293b;
          font-family: 'DM Mono', 'Fira Mono', monospace;
          letter-spacing: 0.02em;
        }
        .clock-date {
          font-size: 11px;
          color: #94a3b8;
          font-weight: 500;
        }
        .clock-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #22c55e;
          animation: clockpulse 2s ease-in-out infinite;
          flex-shrink: 0;
        }
        @keyframes clockpulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.8); }
        }
        .notif-btn {
          position: relative;
          width: 36px;
          height: 36px;
          border-radius: 8px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #64748b;
          cursor: pointer;
          transition: background 0.15s, border-color 0.15s, color 0.15s;
        }
        .notif-btn:hover {
          background: #f1f5f9;
          color: #334155;
          border-color: #cbd5e1;
        }
        .notif-badge {
          position: absolute;
          top: -4px;
          right: -4px;
          min-width: 18px;
          height: 18px;
          background: #ef4444;
          color: white;
          font-size: 10px;
          font-weight: 700;
          border-radius: 99px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 4px;
          border: 2px solid #fff;
        }
        .user-avatar {
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
        .user-trigger {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 4px 8px 4px 4px;
          border-radius: 10px;
          border: 1px solid #e2e8f0;
          background: #f8fafc;
          cursor: pointer;
          transition: background 0.15s, border-color 0.15s;
        }
        .user-trigger:hover {
          background: #f1f5f9;
          border-color: #cbd5e1;
        }
        .user-name-chip {
          font-size: 13px;
          font-weight: 600;
          color: #1e293b;
          max-width: 100px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .dropdown-panel {
          position: absolute;
          right: 0;
          top: calc(100% + 8px);
          width: 224px;
          background: #fff;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          box-shadow: 0 8px 32px rgba(15,23,42,0.12), 0 2px 8px rgba(15,23,42,0.06);
          overflow: hidden;
          animation: dropIn 0.15s ease-out;
        }
        @keyframes dropIn {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .dropdown-header {
          padding: 12px 14px 10px;
          border-bottom: 1px solid #f1f5f9;
        }
        .dropdown-user-name {
          font-size: 13.5px;
          font-weight: 700;
          color: #0f172a;
        }
        .dropdown-user-email {
          font-size: 11.5px;
          color: #94a3b8;
          margin-top: 1px;
        }
        .dropdown-user-role {
          display: inline-block;
          margin-top: 5px;
          font-size: 10.5px;
          font-weight: 600;
          color: #6366f1;
          background: rgba(99,102,241,0.08);
          border-radius: 4px;
          padding: 1px 7px;
          letter-spacing: 0.03em;
        }
        .dropdown-item {
          display: flex;
          align-items: center;
          gap: 10px;
          width: 100%;
          padding: 9px 14px;
          font-size: 13px;
          font-weight: 500;
          color: #475569;
          background: none;
          border: none;
          cursor: pointer;
          text-align: left;
          transition: background 0.12s, color 0.12s;
          font-family: inherit;
        }
        .dropdown-item:hover {
          background: #f8fafc;
          color: #1e293b;
        }
        .dropdown-item.danger { color: #ef4444; }
        .dropdown-item.danger:hover { background: #fef2f2; color: #dc2626; }
        .dropdown-divider {
          height: 1px;
          background: #f1f5f9;
          margin: 2px 0;
        }
        .page-title {
          font-size: 17px;
          font-weight: 700;
          color: #0f172a;
          letter-spacing: -0.02em;
          font-family: 'DM Sans', sans-serif;
        }
        .breadcrumb-wrap {
          display: flex;
          align-items: center;
          gap: 4px;
          margin-top: 1px;
        }
        .breadcrumb-item {
          font-size: 11.5px;
          color: #94a3b8;
          font-weight: 500;
        }
        .breadcrumb-sep {
          font-size: 11px;
          color: #cbd5e1;
        }
        .mobile-menu-btn {
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
          background: #f8fafc;
          color: #64748b;
          cursor: pointer;
          transition: background 0.15s;
        }
        .mobile-menu-btn:hover { background: #f1f5f9; }
      `}</style>

      <header className="header-root px-5 py-3 relative">
        <div className="flex items-center justify-between gap-4">
          {/* Left: mobile menu + title */}
          <div className="flex items-center gap-3">
            <button className="md:hidden mobile-menu-btn" onClick={onMenuClick}>
              <Menu size={18} />
            </button>
            <div>
              <div className="page-title">{getPageTitle()}</div>
              <div className="breadcrumb-wrap">
                {getBreadcrumb().map((crumb, i, arr) => (
                  <React.Fragment key={i}>
                    <span className="breadcrumb-item">{crumb}</span>
                    {i < arr.length - 1 && <span className="breadcrumb-sep">/</span>}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-2.5">
            {/* Search */}
            <div className="hidden md:block header-search-wrap">
              <Search size={14} className="header-search-icon" />
              <input type="text" placeholder="Search anything..." className="header-search-input" />
            </div>

            {/* Clock */}
            <div className="hidden lg:flex clock-chip">
              <div className="clock-dot" />
              <div className="flex flex-col">
                <span className="clock-time">{formatTime(currentTime)}</span>
                <span className="clock-date">{formatDate(currentTime)}</span>
              </div>
            </div>

            {/* Notifications */}
            <button className="notif-btn" onClick={handleNotificationClick} title="Notifications">
              <Bell size={16} />
              {notificationCount > 0 && (
                <span className="notif-badge">{notificationCount > 99 ? '99+' : notificationCount}</span>
              )}
              {loading && (
                <span className="notif-badge" style={{ background: '#6366f1' }}>
                  <span style={{ display: 'block', width: 8, height: 8, border: '1.5px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
                </span>
              )}
            </button>

            {/* User menu */}
            <div className="relative" ref={userMenuRef}>
              <button className="user-trigger" onClick={() => setShowUserMenu(!showUserMenu)}>
                <div className="user-avatar">{userInitials}</div>
                <span className="user-name-chip hidden md:block">{user?.name || 'Admin'}</span>
                <ChevronDown size={13} style={{ color: '#94a3b8', flexShrink: 0 }} />
              </button>

              {showUserMenu && (
                <div className="dropdown-panel" style={{ zIndex: Z_INDEX.DROPDOWN }}>
                  <div className="dropdown-header">
                    <div className="dropdown-user-name">{user?.name || 'Admin User'}</div>
                    <div className="dropdown-user-email">{user?.email || 'admin@store-xen.com'}</div>
                    <span className="dropdown-user-role">{user?.role || 'Administrator'}</span>
                  </div>
                  <div className="py-1">
                    <button className="dropdown-item" onClick={handleProfileClick}>
                      <User size={15} /> Profile
                    </button>
                    <button className="dropdown-item" onClick={handleSettingsClick}>
                      <Settings size={15} /> Settings
                    </button>
                    <div className="dropdown-divider" />
                    <button className="dropdown-item danger" onClick={handleLogout}>
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