import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  Warehouse,
  ShoppingCart,
  BarChart3,
  Settings,
  ChevronDown,
  ChevronRight,
  Store,
  PackageIcon,
  UserCircle,
  PanelLeftClose,
  PanelLeftOpen
} from 'lucide-react'
import { Z_INDEX } from '../../constants/zIndex'

const Sidebar = ({ isOpen, onClose }) => {
  const [activeDropdown, setActiveDropdown] = useState(null)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const location = useLocation()

  useEffect(() => {
    try {
      const saved = localStorage.getItem('sidebarCollapsed')
      if (saved !== null) setSidebarCollapsed(saved === 'true')
    } catch { /* ignore */ }
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem('sidebarCollapsed', String(sidebarCollapsed))
    } catch { /* ignore */ }
  }, [sidebarCollapsed])

  const menuItems = [
    {
      id: 'dashboard',
      title: 'Dashboard',
      icon: LayoutDashboard,
      path: '/dashboard',
      subItems: [
        { title: 'Overview', path: '/dashboard/overview' },
        { title: 'Notifications', path: '/dashboard/notifications' }
      ]
    },
    {
      id: 'products',
      title: 'Products',
      icon: PackageIcon,
      path: '/products',
      subItems: [
        { title: 'Manage Products', path: '/products/manage' },
        { title: 'Add New Product', path: '/products/add' }
      ]
    },
    {
      id: 'suppliers',
      title: 'Suppliers',
      icon: Users,
      path: '/suppliers',
      subItems: [
        { title: 'Manage Suppliers', path: '/suppliers/manage' },
        { title: 'Purchase Orders (PO)', path: '/suppliers/purchase-orders' },
        { title: 'Goods Receive Note (GRN)', path: '/suppliers/grn' },
        { title: 'Payments', path: '/suppliers/payments' }
      ]
    },
    {
      id: 'warehouse',
      title: 'Warehouse / Stock',
      icon: Warehouse,
      path: '/warehouse',
      subItems: [
        { title: 'Inhouse Products', path: '/warehouse/inhouse-products' },
        { title: 'Stock In (from GRN)', path: '/warehouse/stock-in' },
        { title: 'Inventory Tracking', path: '/warehouse/inventory-tracking' },
        { title: 'Stock Transfer', path: '/warehouse/stock-transfer' },
        { title: 'Warehouse List', path: '/warehouse/list' }
      ]
    },
    {
      id: 'sales',
      title: 'Sales (POS)',
      icon: ShoppingCart,
      path: '/sales',
      subItems: [
        { title: 'POS Terminal', path: '/sales/pos-terminal' },
        { title: 'Discounts / Offers', path: '/sales/discounts' },
        { title: 'Payments', path: '/sales/payments' },
        { title: 'Invoice / Receipt', path: '/sales/invoice' },
        { title: 'Returns', path: '/sales/returns' }
      ]
    },
    {
      id: 'inventory',
      title: 'Inventory & Reports',
      icon: BarChart3,
      path: '/inventory',
      subItems: [
        { title: 'Real-time Stock Dashboard', path: '/inventory/stock-dashboard' },
        { title: 'Low Stock Alerts', path: '/inventory/low-stock' },
        { title: 'Auto Reorder Suggestions', path: '/inventory/reorder' },
        { title: 'Inventory Valuation', path: '/inventory/valuation' },
        { title: 'Sales Reports', path: '/inventory/sales-reports' },
        { title: 'Profit & Loss Reports', path: '/inventory/profit-loss' },
        { title: 'Fast-moving & Dead Stock', path: '/inventory/stock-analysis' }
      ]
    },
    {
      id: 'profile',
      title: 'Profile',
      icon: UserCircle,
      path: '/profile'
    },
    {
      id: 'settings',
      title: 'Settings',
      icon: Settings,
      path: '/settings'
    }
  ]

  const handleDropdownToggle = (itemId) => {
    setActiveDropdown(activeDropdown === itemId ? null : itemId)
  }

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/')
  }

  const handleLinkClick = () => {
    if (onClose) onClose()
    setActiveDropdown(null)
  }

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm md:hidden"
          style={{ zIndex: Z_INDEX.MOBILE_OVERLAY }}
          onClick={onClose}
        />
      )}

      <style>{`
        .sidebar-root {
          background: #0f1117;
          border-right: 1px solid rgba(255,255,255,0.06);
          font-family: 'DM Sans', 'Inter', sans-serif;
        }
        .sidebar-logo-area {
          border-bottom: 1px solid rgba(255,255,255,0.06);
          background: #0f1117;
        }
        .sidebar-logo-text {
          font-family: 'DM Sans', sans-serif;
          font-weight: 700;
          font-size: 1rem;
          letter-spacing: -0.02em;
          background: linear-gradient(135deg, #fff 60%, #94a3b8);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .logo-icon-wrap {
          width: 32px;
          height: 32px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 0 1px rgba(99,102,241,0.3), 0 4px 12px rgba(99,102,241,0.25);
          flex-shrink: 0;
        }
        .collapse-btn {
          width: 28px;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 6px;
          color: #64748b;
          transition: background 0.15s, color 0.15s;
          cursor: pointer;
          border: none;
          background: transparent;
          flex-shrink: 0;
        }
        .collapse-btn:hover {
          background: rgba(255,255,255,0.07);
          color: #94a3b8;
        }
        .section-label {
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #334155;
          padding: 0 12px;
          margin: 12px 0 4px;
        }
        .nav-item-btn, .nav-item-link {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 7px 10px;
          border-radius: 8px;
          font-size: 13.5px;
          font-weight: 500;
          color: #64748b;
          cursor: pointer;
          background: transparent;
          border: none;
          text-align: left;
          text-decoration: none;
          transition: background 0.15s, color 0.15s;
          position: relative;
        }
        .nav-item-btn:hover, .nav-item-link:hover {
          background: rgba(255,255,255,0.05);
          color: #cbd5e1;
        }
        .nav-item-btn.active, .nav-item-link.active {
          background: rgba(99,102,241,0.12);
          color: #a5b4fc;
        }
        .nav-item-btn.active .nav-icon, .nav-item-link.active .nav-icon {
          color: #818cf8;
        }
        .nav-icon {
          flex-shrink: 0;
          color: #475569;
          transition: color 0.15s;
        }
        .nav-item-btn:hover .nav-icon, .nav-item-link:hover .nav-icon {
          color: #94a3b8;
        }
        .nav-label { flex: 1; }
        .chevron-icon {
          color: #334155;
          flex-shrink: 0;
          transition: transform 0.2s;
        }
        .chevron-icon.open { transform: rotate(180deg); }
        .sub-items-wrap {
          margin-left: 32px;
          margin-top: 2px;
          display: flex;
          flex-direction: column;
          gap: 1px;
          border-left: 1px solid rgba(255,255,255,0.06);
          padding-left: 12px;
          padding-bottom: 4px;
        }
        .sub-item-link {
          display: block;
          padding: 5px 8px;
          border-radius: 6px;
          font-size: 12.5px;
          font-weight: 450;
          color: #475569;
          text-decoration: none;
          transition: background 0.12s, color 0.12s;
        }
        .sub-item-link:hover {
          background: rgba(255,255,255,0.04);
          color: #94a3b8;
        }
        .sub-item-link.active {
          color: #a5b4fc;
          background: rgba(99,102,241,0.1);
        }
        .tooltip-popup {
          position: absolute;
          left: calc(100% + 8px);
          top: 50%;
          transform: translateY(-50%);
          background: #1e293b;
          border: 1px solid rgba(255,255,255,0.08);
          color: #e2e8f0;
          font-size: 12px;
          font-weight: 500;
          padding: 4px 10px;
          border-radius: 6px;
          white-space: nowrap;
          pointer-events: none;
          box-shadow: 0 4px 16px rgba(0,0,0,0.4);
          display: none;
          z-index: 9999;
        }
        .group:hover .tooltip-popup { display: block; }
        .sidebar-nav-scroll::-webkit-scrollbar { width: 3px; }
        .sidebar-nav-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 99px; }
        .collapsed-item-wrap { position: relative; }
        .collapsed-nav-btn {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: transparent;
          border: none;
          cursor: pointer;
          color: #475569;
          transition: background 0.15s, color 0.15s;
          margin: 0 auto;
        }
        .collapsed-nav-btn:hover { background: rgba(255,255,255,0.07); color: #94a3b8; }
        .collapsed-nav-btn.active { background: rgba(99,102,241,0.14); color: #818cf8; }
      `}</style>

      {/* Sidebar */}
      <aside
        className={`
          fixed md:relative inset-y-0 left-0
          sidebar-root
          transition-all duration-300 ease-in-out
          ${sidebarCollapsed ? 'w-[64px]' : 'w-[240px]'}
          ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          flex flex-col
        `}
        style={{ zIndex: Z_INDEX.SIDEBAR }}
        role="navigation"
        aria-label="Primary"
      >
        {/* Logo */}
        <div className="sidebar-logo-area flex items-center justify-between px-4 py-[14px] sticky top-0" style={{ zIndex: Z_INDEX.SIDEBAR_STICKY }}>
          {!sidebarCollapsed && (
            <Link to="/" className="flex items-center gap-2.5 flex-1 min-w-0" onClick={handleLinkClick}>
              <div className="logo-icon-wrap">
                <Store className="h-4 w-4 text-white" />
              </div>
              <span className="sidebar-logo-text truncate">Store-Xen POS</span>
            </Link>
          )}
          {sidebarCollapsed && (
            <div className="flex justify-center w-full">
              <div className="logo-icon-wrap">
                <Store className="h-4 w-4 text-white" />
              </div>
            </div>
          )}
          {!sidebarCollapsed && (
            <button className="collapse-btn ml-2" onClick={() => setSidebarCollapsed(true)} title="Collapse sidebar">
              <PanelLeftClose size={16} />
            </button>
          )}
          {sidebarCollapsed && (
            <button
              className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-[#1e293b] border border-[rgba(255,255,255,0.08)] rounded-full flex items-center justify-center text-[#64748b] hover:text-[#94a3b8] hover:bg-[#263148] transition-all cursor-pointer shadow-lg"
              onClick={() => setSidebarCollapsed(false)}
              title="Expand sidebar"
              style={{ zIndex: 10 }}
            >
              <PanelLeftOpen size={12} />
            </button>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto sidebar-nav-scroll py-3" aria-label="Sidebar menu">
          {!sidebarCollapsed && (
            <div className="px-3 space-y-0.5">
              {menuItems.map((item) => {
                const Icon = item.icon
                const active = isActive(item.path)
                const isOpen = activeDropdown === item.id

                // Section grouping labels
                const sectionLabels = {
                  dashboard: 'Main',
                  suppliers: 'Operations',
                  inventory: 'Analytics',
                  profile: 'Account'
                }

                return (
                  <div key={item.id}>
                    {sectionLabels[item.id] && (
                      <div className="section-label">{sectionLabels[item.id]}</div>
                    )}
                    {item.subItems ? (
                      <>
                        <button
                          onClick={() => handleDropdownToggle(item.id)}
                          className={`nav-item-btn ${active ? 'active' : ''}`}
                          aria-expanded={isOpen}
                        >
                          <Icon size={16} className="nav-icon" />
                          <span className="nav-label">{item.title}</span>
                          <ChevronDown size={14} className={`chevron-icon ${isOpen ? 'open' : ''}`} />
                        </button>
                        {isOpen && (
                          <div className="sub-items-wrap">
                            {item.subItems.map((sub, i) => (
                              <Link
                                key={i}
                                to={sub.path}
                                className={`sub-item-link ${isActive(sub.path) ? 'active' : ''}`}
                                onClick={handleLinkClick}
                              >
                                {sub.title}
                              </Link>
                            ))}
                          </div>
                        )}
                      </>
                    ) : (
                      <Link
                        to={item.path}
                        className={`nav-item-link ${active ? 'active' : ''}`}
                        onClick={handleLinkClick}
                      >
                        <Icon size={16} className="nav-icon" />
                        <span className="nav-label">{item.title}</span>
                      </Link>
                    )}
                  </div>
                )
              })}
            </div>
          )}

          {/* Collapsed icon-only nav */}
          {sidebarCollapsed && (
            <div className="flex flex-col gap-1 px-2 py-1">
              {menuItems.map((item) => {
                const Icon = item.icon
                const active = isActive(item.path)
                return (
                  <div key={item.id} className="group collapsed-item-wrap">
                    {item.subItems ? (
                      <button
                        onClick={() => handleDropdownToggle(item.id)}
                        className={`collapsed-nav-btn ${active ? 'active' : ''}`}
                        title={item.title}
                      >
                        <Icon size={18} />
                      </button>
                    ) : (
                      <Link
                        to={item.path}
                        className={`collapsed-nav-btn ${active ? 'active' : ''}`}
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', borderRadius: '10px' }}
                        onClick={handleLinkClick}
                      >
                        <Icon size={18} />
                      </Link>
                    )}
                    <div className="tooltip-popup">{item.title}</div>
                  </div>
                )
              })}
            </div>
          )}
        </nav>

        {/* Bottom version tag */}
        {!sidebarCollapsed && (
          <div className="px-4 py-3 border-t border-[rgba(255,255,255,0.05)]">
            <span style={{ fontSize: 11, color: '#1e293b', fontWeight: 600, letterSpacing: '0.05em' }}>v2.0 · PREMIUM</span>
          </div>
        )}
      </aside>
    </>
  )
}

export default Sidebar