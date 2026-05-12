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
  Store,
  PackageIcon,
  UserCircle
} from 'lucide-react'
import { Z_INDEX } from '../../constants/zIndex'

/**
 * Sidebar props:
 *  isOpen      – mobile overlay drawer open state
 *  isCollapsed – icon-only collapse (all device sizes), controlled by Header hamburger
 *  onClose     – close mobile drawer
 */
const Sidebar = ({ isOpen, isCollapsed, onClose }) => {
  const [activeDropdown, setActiveDropdown] = useState(null)
  const location = useLocation()

  // Auto-close dropdowns when collapsing to icon-only
  useEffect(() => {
    if (isCollapsed) setActiveDropdown(null)
  }, [isCollapsed])

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

  // Section labels inserted before specific items
  const sectionLabels = {
    dashboard: 'Main',
    suppliers: 'Operations',
    inventory: 'Analytics',
    profile: 'Account'
  }

  const handleDropdownToggle = (itemId) => {
    if (isCollapsed) return // no dropdowns in icon-only mode
    setActiveDropdown(prev => prev === itemId ? null : itemId)
  }

  const isActive = (path) =>
    location.pathname === path || location.pathname.startsWith(path + '/')

  const handleLinkClick = () => {
    if (onClose) onClose()
    setActiveDropdown(null)
  }

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm md:hidden"
          style={{ zIndex: Z_INDEX.MOBILE_OVERLAY }}
          onClick={onClose}
        />
      )}

      <style>{`
        /* ── Sidebar uses CSS variables from index.css for full dark/light support ── */
        .sb-root {
          background: var(--sidebar);
          border-right: 1px solid var(--sidebar-border);
          color: var(--sidebar-foreground);
          font-family: var(--font-sans, 'DM Sans', sans-serif);
          display: flex;
          flex-direction: column;
          transition: width 0.25s cubic-bezier(0.4,0,0.2,1);
          will-change: width;
        }

        /* Logo bar */
        .sb-logo-area {
          border-bottom: 1px solid var(--sidebar-border);
          background: var(--sidebar);
          display: flex;
          align-items: center;
          padding: 14px 16px;
          position: sticky;
          top: 0;
          overflow: hidden;
          flex-shrink: 0;
        }
        .sb-logo-icon {
          width: 32px;
          height: 32px;
          min-width: 32px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 0 1px rgba(99,102,241,0.3), 0 4px 12px rgba(99,102,241,0.2);
        }
        .sb-logo-text {
          font-weight: 700;
          font-size: 15px;
          letter-spacing: -0.02em;
          color: var(--sidebar-foreground);
          white-space: nowrap;
          overflow: hidden;
          opacity: 1;
          transition: opacity 0.15s, max-width 0.25s;
          max-width: 180px;
          margin-left: 10px;
        }
        .sb-logo-text.collapsed {
          opacity: 0;
          max-width: 0;
          margin-left: 0;
        }

        /* Section labels */
        .sb-section-label {
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--muted-foreground);
          padding: 0 10px;
          margin: 14px 0 4px;
          white-space: nowrap;
          overflow: hidden;
          opacity: 1;
          transition: opacity 0.15s;
        }
        .sb-section-label.collapsed { opacity: 0; height: 0; margin: 0; padding: 0; }

        /* Nav items */
        .sb-nav-item {
          width: 100%;
          display: flex;
          align-items: center;
          padding: 7px 10px;
          border-radius: 8px;
          font-size: 13.5px;
          font-weight: 500;
          color: var(--sidebar-foreground);
          cursor: pointer;
          background: transparent;
          border: none;
          text-align: left;
          text-decoration: none;
          transition: background 0.15s, color 0.15s;
          position: relative;
          gap: 10px;
          opacity: 0.65;
          overflow: hidden;
          white-space: nowrap;
        }
        .sb-nav-item:hover {
          background: var(--sidebar-accent);
          color: var(--sidebar-accent-foreground);
          opacity: 1;
        }
        .sb-nav-item.active {
          background: var(--sidebar-primary);
          color: var(--sidebar-primary-foreground);
          opacity: 1;
        }
        /* Collapsed: centre the icon */
        .sb-nav-item.icon-only {
          justify-content: center;
          padding: 10px;
        }

        /* Icon */
        .sb-nav-icon { flex-shrink: 0; }

        /* Label + chevron fade */
        .sb-nav-label {
          flex: 1;
          overflow: hidden;
          text-overflow: ellipsis;
          transition: opacity 0.15s, max-width 0.25s;
          max-width: 160px;
        }
        .sb-nav-label.hidden-label { opacity: 0; max-width: 0; }
        .sb-chevron {
          flex-shrink: 0;
          color: var(--muted-foreground);
          transition: transform 0.2s, opacity 0.15s;
        }
        .sb-chevron.open { transform: rotate(180deg); }
        .sb-chevron.hidden-label { opacity: 0; width: 0; }

        /* Sub items */
        .sb-sub-wrap {
          margin-left: 32px;
          margin-top: 2px;
          display: flex;
          flex-direction: column;
          gap: 1px;
          border-left: 1px solid var(--sidebar-border);
          padding-left: 12px;
          padding-bottom: 4px;
        }
        .sb-sub-link {
          display: block;
          padding: 5px 8px;
          border-radius: 6px;
          font-size: 12.5px;
          font-weight: 450;
          color: var(--sidebar-foreground);
          text-decoration: none;
          opacity: 0.55;
          transition: background 0.12s, color 0.12s, opacity 0.12s;
          white-space: nowrap;
        }
        .sb-sub-link:hover {
          background: var(--sidebar-accent);
          color: var(--sidebar-accent-foreground);
          opacity: 1;
        }
        .sb-sub-link.active {
          background: color-mix(in oklch, var(--sidebar-primary) 15%, transparent);
          color: var(--sidebar-primary);
          opacity: 1;
        }

        /* Tooltip when collapsed */
        .sb-item-wrap { position: relative; }
        .sb-tooltip {
          position: absolute;
          left: calc(100% + 8px);
          top: 50%;
          transform: translateY(-50%);
          background: var(--popover);
          color: var(--popover-foreground);
          border: 1px solid var(--border);
          font-size: 12px;
          font-weight: 500;
          padding: 4px 10px;
          border-radius: 6px;
          white-space: nowrap;
          pointer-events: none;
          box-shadow: 0 4px 16px rgba(0,0,0,0.15);
          display: none;
          z-index: 9999;
        }
        .sb-item-wrap:hover .sb-tooltip { display: block; }

        /* Scrollbar */
        .sb-scroll::-webkit-scrollbar { width: 3px; }
        .sb-scroll::-webkit-scrollbar-thumb {
          background: var(--sidebar-border);
          border-radius: 99px;
        }

        /* Footer tag */
        .sb-footer {
          border-top: 1px solid var(--sidebar-border);
          padding: 10px 16px;
          flex-shrink: 0;
        }
        .sb-footer-tag {
          font-size: 10.5px;
          font-weight: 600;
          letter-spacing: 0.08em;
          color: var(--muted-foreground);
          opacity: 0.5;
          white-space: nowrap;
          overflow: hidden;
          transition: opacity 0.15s;
        }
        .sb-footer-tag.collapsed { opacity: 0; }
      `}</style>

      <aside
        className={[
          'sb-root',
          'fixed md:relative inset-y-0 left-0',
          isCollapsed ? 'w-[64px]' : 'w-[240px]',
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
          'transition-all duration-300 ease-in-out'
        ].join(' ')}
        style={{ zIndex: Z_INDEX.SIDEBAR }}
        role="navigation"
        aria-label="Primary navigation"
      >
        {/* Logo */}
        <div className="sb-logo-area" style={{ zIndex: Z_INDEX.SIDEBAR_STICKY }}>
          <Link
            to="/"
            className="flex items-center"
            onClick={handleLinkClick}
            style={{ textDecoration: 'none', minWidth: 0 }}
          >
            <div className="sb-logo-icon">
              <Store className="h-4 w-4 text-white" />
            </div>
            <span className={`sb-logo-text ${isCollapsed ? 'collapsed' : ''}`}>
              Store-Xen POS
            </span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto sb-scroll py-2" aria-label="Sidebar menu">
          <div className="px-2 space-y-0.5">
            {menuItems.map((item) => {
              const Icon = item.icon
              const active = isActive(item.path)
              const open = activeDropdown === item.id

              return (
                <div key={item.id} className="sb-item-wrap">
                  {/* Section label */}
                  {sectionLabels[item.id] && (
                    <div className={`sb-section-label ${isCollapsed ? 'collapsed' : ''}`}>
                      {sectionLabels[item.id]}
                    </div>
                  )}

                  {/* Item with sub-items */}
                  {item.subItems ? (
                    <>
                      <button
                        onClick={() => handleDropdownToggle(item.id)}
                        className={`sb-nav-item ${active ? 'active' : ''} ${isCollapsed ? 'icon-only' : ''}`}
                        aria-expanded={open}
                      >
                        <Icon size={17} className="sb-nav-icon" />
                        <span className={`sb-nav-label ${isCollapsed ? 'hidden-label' : ''}`}>
                          {item.title}
                        </span>
                        <ChevronDown
                          size={14}
                          className={`sb-chevron ${open ? 'open' : ''} ${isCollapsed ? 'hidden-label' : ''}`}
                        />
                      </button>
                      {!isCollapsed && open && (
                        <div className="sb-sub-wrap">
                          {item.subItems.map((sub, i) => (
                            <Link
                              key={i}
                              to={sub.path}
                              className={`sb-sub-link ${isActive(sub.path) ? 'active' : ''}`}
                              onClick={handleLinkClick}
                            >
                              {sub.title}
                            </Link>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    /* Item without sub-items */
                    <Link
                      to={item.path}
                      className={`sb-nav-item ${active ? 'active' : ''} ${isCollapsed ? 'icon-only' : ''}`}
                      onClick={handleLinkClick}
                      aria-current={active ? 'page' : undefined}
                    >
                      <Icon size={17} className="sb-nav-icon" />
                      <span className={`sb-nav-label ${isCollapsed ? 'hidden-label' : ''}`}>
                        {item.title}
                      </span>
                    </Link>
                  )}

                  {/* Tooltip shown only when collapsed */}
                  {isCollapsed && (
                    <div className="sb-tooltip">{item.title}</div>
                  )}
                </div>
              )
            })}
          </div>
        </nav>

        {/* Footer */}
        <div className="sb-footer">
          <span className={`sb-footer-tag ${isCollapsed ? 'collapsed' : ''}`}>
            v2.0 · PREMIUM
          </span>
        </div>
      </aside>
    </>
  )
}

export default Sidebar