import React, { useEffect, useState, useMemo } from 'react'
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
  UserCircle,
  X
} from 'lucide-react'
import { Z_INDEX } from '../../constants/zIndex'

const MOBILE_BREAKPOINT = 768

const Sidebar = ({ isOpen, isCollapsed, onClose }) => {
  const location = useLocation()
  const [activeDropdown, setActiveDropdown] = useState(null)
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.innerWidth < MOBILE_BREAKPOINT
  )

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const update = () => setIsMobile(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  // Close drawer when navigating on mobile
  useEffect(() => {
    if (isMobile) onClose?.()
  }, [location.pathname, isMobile, onClose])

  // Close drawer when resizing to desktop
  useEffect(() => {
    const mq = window.matchMedia(`(min-width: ${MOBILE_BREAKPOINT}px)`)
    const handleChange = (e) => {
      if (e.matches) onClose?.()
    }
    mq.addEventListener('change', handleChange)
    return () => mq.removeEventListener('change', handleChange)
  }, [onClose])

  // Prevent background scroll while mobile drawer is open
  useEffect(() => {
    if (!isOpen || !isMobile) return undefined
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [isOpen, isMobile])

  const showCollapsed = isCollapsed && !isMobile

  const menuItems = useMemo(() => [
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
        { title: 'Purchase Orders', path: '/suppliers/purchase-orders' },
        { title: 'GRN', path: '/suppliers/grn' },
        { title: 'Payments', path: '/suppliers/payments' }
      ]
    },
    {
      id: 'warehouse',
      title: 'Warehouse',
      icon: Warehouse,
      path: '/warehouse',
      subItems: [
        { title: 'Inhouse Products', path: '/warehouse/inhouse-products' },
        { title: 'Inventory Tracking', path: '/warehouse/inventory-tracking' },
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
        { title: 'Discounts', path: '/sales/discounts' },
        { title: 'Returns', path: '/sales/returns' }
      ]
    },
    {
      id: 'inventory',
      title: 'Analytics',
      icon: BarChart3,
      path: '/inventory',
      subItems: [
        { title: 'Stock Dashboard', path: '/inventory/stock-dashboard' },
        { title: 'Sales Reports', path: '/inventory/sales-reports' },
        { title: 'Profit & Loss', path: '/inventory/profit-loss' }
      ]
    },
    { id: 'profile', title: 'Profile', icon: UserCircle, path: '/profile' },
    { id: 'settings', title: 'Settings', icon: Settings, path: '/settings' }
  ], [])

  const sectionLabels = {
    dashboard: 'Main',
    suppliers: 'Operations',
    inventory: 'Analytics',
    profile: 'Account'
  }

  // Effect: Sync active dropdown with current URL on load or navigation
  useEffect(() => {
    if (showCollapsed) {
      setActiveDropdown(null)
      return
    }
    const currentItem = menuItems.find(item => 
      item.subItems?.some(sub => location.pathname.startsWith(sub.path))
    )
    if (currentItem) setActiveDropdown(currentItem.id)
  }, [location.pathname, showCollapsed, menuItems])

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/')

  const handleDropdownToggle = (e, itemId) => {
    e.preventDefault()
    if (showCollapsed) return
    setActiveDropdown(prev => prev === itemId ? null : itemId)
  }

  const closeMobile = () => {
    if (isMobile) onClose?.()
  }

  return (
    <>
      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm md:hidden transition-opacity duration-300 ease-out ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        style={{ zIndex: Z_INDEX.MOBILE_OVERLAY }}
        onClick={onClose}
        aria-hidden={!isOpen}
      />

      <style>{`
        .sb-root {
          background: var(--sidebar);
          border-right: 1px solid var(--sidebar-border);
          color: var(--sidebar-foreground);
          display: flex;
          flex-direction: column;
          will-change: transform;
        }

        @media (min-width: 768px) {
          .sb-root {
            transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }
        }

        @media (max-width: 767px) {
          .sb-root {
            width: 16rem !important;
            transition: transform 0.32s cubic-bezier(0.32, 0.72, 0, 1);
            box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.35);
          }
        }

        .sb-nav-item {
          display: flex;
          align-items: center;
          padding: 9px 12px;
          margin: 2px 8px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          color: var(--sidebar-foreground);
          transition: all 0.2s ease;
          opacity: 0.8;
          position: relative;
        }

        .sb-nav-item:hover {
          background: var(--sidebar-accent);
          opacity: 1;
        }

        .sb-nav-item.active-parent {
          background: var(--sidebar-accent);
          color: var(--sidebar-primary);
          opacity: 1;
        }

        .sb-nav-item.active-link {
          background: var(--sidebar-primary);
          color: var(--sidebar-primary-foreground);
          opacity: 1;
        }

        /* Active highlight line */
        .sb-nav-item.active-link::before {
          content: "";
          position: absolute;
          left: -8px;
          top: 20%;
          height: 60%;
          width: 4px;
          background: var(--sidebar-primary);
          border-radius: 0 4px 4px 0;
        }

        .dropdown-container {
          display: grid;
          grid-template-rows: 0fr;
          transition: grid-template-rows 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          overflow: hidden;
          margin-left: 28px;
          padding-left: 12px;
          border-left: 1px solid var(--sidebar-border);
        }

        .dropdown-container.open {
          grid-template-rows: 1fr;
          margin-bottom: 8px;
        }

        .sb-sub-link {
          display: block;
          padding: 7px 12px;
          font-size: 13px;
          color: var(--muted-foreground);
          border-radius: 6px;
          transition: all 0.2s;
        }

        .sb-sub-link:hover {
          color: var(--sidebar-foreground);
          background: var(--sidebar-accent);
        }

        .sb-sub-link.active {
          color: var(--sidebar-primary);
          font-weight: 600;
        }

        .sb-tooltip {
          position: fixed;
          left: 70px;
          background: var(--popover);
          color: var(--popover-foreground);
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 12px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          border: 1px solid var(--border);
          pointer-events: none;
          visibility: hidden;
          opacity: 0;
          transition: 0.2s;
          z-index: 1000;
        }

        .sb-item-group:hover .sb-tooltip {
          visibility: visible;
          opacity: 1;
          transform: translateX(5px);
        }

        .sb-scroll::-webkit-scrollbar { width: 4px; }
        .sb-scroll::-webkit-scrollbar-thumb { background: var(--sidebar-border); border-radius: 10px; }
      `}</style>

      <aside
        className={`sb-root fixed md:relative inset-y-0 left-0 top-0 h-full max-h-[100dvh]
          ${showCollapsed ? 'md:w-16 w-64' : 'w-64'}
          ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
        style={{ zIndex: Z_INDEX.SIDEBAR }}
        aria-hidden={isMobile && !isOpen}
      >
        {/* Logo Section */}
        <div className="h-16 flex items-center justify-between px-4 mb-2 border-b border-[var(--sidebar-border)] shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shrink-0 shadow-lg shadow-indigo-500/20">
              <Store size={18} className="text-white" />
            </div>
            {!showCollapsed && (
              <span className="font-bold text-lg tracking-tight truncate">
                Retail<span className="text-indigo-500">Flow</span>
              </span>
            )}
          </div>
          {isMobile && (
            <button
              type="button"
              onClick={onClose}
              className="md:hidden p-2 rounded-lg text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors"
              aria-label="Close navigation menu"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto sb-scroll py-4">
          {menuItems.map((item) => {
            const Icon = item.icon
            const hasSubItems = !!item.subItems
            const isParentActive = hasSubItems && item.subItems.some(sub => isActive(sub.path))
            const isSingleActive = !hasSubItems && isActive(item.path)
            const isDropdownOpen = activeDropdown === item.id

            return (
              <div key={item.id} className="sb-item-group mb-1">
                {/* Section Label */}
                {sectionLabels[item.id] && !showCollapsed && (
                  <p className="px-6 mt-4 mb-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground opacity-50">
                    {sectionLabels[item.id]}
                  </p>
                )}

                {/* Main Link/Button */}
                {hasSubItems ? (
                  <button
                    onClick={(e) => handleDropdownToggle(e, item.id)}
                    className={`sb-nav-item w-[calc(100%-16px)] ${isParentActive ? 'active-parent' : ''} ${showCollapsed ? 'justify-center !mx-2' : ''}`}
                  >
                    <Icon size={20} className={isParentActive ? 'text-indigo-500' : ''} />
                    {!showCollapsed && (
                      <>
                        <span className="ml-3 flex-1 text-left">{item.title}</span>
                        <ChevronDown size={14} className={`transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                      </>
                    )}
                    {showCollapsed && <div className="sb-tooltip">{item.title}</div>}
                  </button>
                ) : (
                  <Link
                    to={item.path}
                    onClick={closeMobile}
                    className={`sb-nav-item ${isSingleActive ? 'active-link' : ''} ${showCollapsed ? 'justify-center !mx-2' : ''}`}
                  >
                    <Icon size={20} />
                    {!showCollapsed && <span className="ml-3">{item.title}</span>}
                    {showCollapsed && <div className="sb-tooltip">{item.title}</div>}
                  </Link>
                )}

                {/* Dropdown Content */}
                {hasSubItems && !showCollapsed && (
                  <div className={`dropdown-container ${isDropdownOpen ? 'open' : ''}`}>
                    <div className="min-h-0">
                      {item.subItems.map((sub, idx) => (
                        <Link
                          key={idx}
                          to={sub.path}
                          onClick={closeMobile}
                          className={`sb-sub-link ${isActive(sub.path) ? 'active' : ''}`}
                        >
                          {sub.title}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-[var(--sidebar-border)] bg-[var(--sidebar)] shrink-0">
          {!showCollapsed ? (
            <div className="flex items-center gap-3 px-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">System Online</span>
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="w-2 h-2 rounded-full bg-green-500" />
            </div>
          )}
        </div>
      </aside>
    </>
  )
}

export default Sidebar
