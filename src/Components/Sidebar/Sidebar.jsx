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
  UserCircle
} from 'lucide-react'
import { Z_INDEX } from '../../constants/zIndex'

const Sidebar = ({ isOpen, onClose }) => {
  const [activeDropdown, setActiveDropdown] = useState(null)
  const location = useLocation()

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
        .group:hover .tooltip-popup { display: block; }
        .sidebar-nav-scroll::-webkit-scrollbar { width: 3px; }
        .sidebar-nav-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 99px; }
      `}</style>

      {/* Sidebar */}
      <aside
        className={`
          fixed md:relative inset-y-0 left-0
          sidebar-root
          transition-all duration-300 ease-in-out
          w-[240px]
          ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          flex flex-col
        `}
        style={{ zIndex: Z_INDEX.SIDEBAR }}
        role="navigation"
        aria-label="Primary"
      >
        {/* Logo */}
        <div className="sidebar-logo-area flex items-center justify-between px-4 py-[14px] sticky top-0" style={{ zIndex: Z_INDEX.SIDEBAR_STICKY }}>
          <Link to="/" className="flex items-center gap-2.5 flex-1 min-w-0" onClick={handleLinkClick}>
            <div className="logo-icon-wrap">
              <Store className="h-4 w-4 text-white" />
            </div>
            <span className="sidebar-logo-text truncate">Store-Xen POS</span>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto sidebar-nav-scroll py-3" aria-label="Sidebar menu">
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
        </nav>

        {/* Bottom version tag */}
        <div className="px-4 py-3 border-t border-[rgba(255,255,255,0.05)]">
          <span style={{ fontSize: 11, color: '#1e293b', fontWeight: 600, letterSpacing: '0.05em' }}>v2.0 · PREMIUM</span>
        </div>
      </aside>
    </>
  )
}

export default Sidebar