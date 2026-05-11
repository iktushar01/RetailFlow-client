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
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const location = useLocation()

  // Load collapsed state
  useEffect(() => {
    try {
      const saved = localStorage.getItem('sidebarCollapsed')
      if (saved !== null) setSidebarCollapsed(saved === 'true')
    } catch { /* ignore persistence read error */ }
  }, [])

  // Persist collapsed state
  useEffect(() => {
    try {
      localStorage.setItem('sidebarCollapsed', String(sidebarCollapsed))
    } catch { /* ignore persistence write error */ }
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
        { title: 'Payments', path: '/suppliers/payments'}
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
        { title: 'POS Terminal', path: '/sales/pos-terminal'},
        { title: 'Discounts / Offers', path: '/sales/discounts' },
        { title: 'Payments', path: '/sales/payments'},
        { title: 'Invoice / Receipt', path: '/sales/invoice'},
        { title: 'Returns', path: '/sales/returns'}
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
        { title: 'Sales Reports', path: '/inventory/sales-reports'},
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
          className="fixed inset-0 bg-black/40 md:hidden"
          style={{ zIndex: Z_INDEX.MOBILE_OVERLAY }}
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`
        fixed md:relative inset-y-0 left-0
        bg-white shadow-lg border-r border-gray-200
        transition-all duration-300 ease-in-out
        ${sidebarCollapsed ? 'w-16' : 'w-64'}
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        flex flex-col
      `}
        style={{ zIndex: Z_INDEX.SIDEBAR }}
        role="navigation" 
        aria-label="Primary"
      >
        {/* Logo Section */}
        <div 
          className="flex items-center justify-between p-4 border-b border-gray-200 sticky top-0 bg-white"
          style={{ zIndex: Z_INDEX.SIDEBAR_STICKY }}
        >
          {!sidebarCollapsed && (
            <Link to="/" className="flex items-center space-x-2" onClick={handleLinkClick}>
              <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Store className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-800">Store-Xen POS</span>
            </Link>
          )}
          {sidebarCollapsed && (
            <div className="flex justify-center w-full">
              <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Store className="h-5 w-5 text-white" />
              </div>
            </div>
          )}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-1 rounded-md hover:bg-gray-100 transition-colors duration-200"
            title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <svg
              className={`w-5 h-5 text-gray-600 transition-transform duration-200 ${
                sidebarCollapsed ? 'rotate-180' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 overflow-y-auto" aria-label="Sidebar menu">
          <div className="p-2 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon
              const active = isActive(item.path)
              return (
                <div key={item.id} className="space-y-1 group relative">
                  {/* Main Menu Item */}
                  {item.subItems ? (
                    <button
                      onClick={() => handleDropdownToggle(item.id)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault()
                          handleDropdownToggle(item.id)
                        }
                      }}
                      className={`w-full flex items-center ${
                        sidebarCollapsed ? 'justify-center px-2 py-3' : 'px-3 py-2'
                      } rounded-md text-sm font-medium transition-colors duration-200 relative ${
                        active
                          ? 'bg-blue-50 text-blue-700'
                          : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                      } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      title={sidebarCollapsed ? item.title : ''}
                      aria-expanded={activeDropdown === item.id}
                      aria-controls={`menu-${item.id}`}
                    >
                      <span className={`absolute left-0 top-0 h-full w-1 rounded-r ${active ? 'bg-blue-600' : 'bg-transparent'}`} />
                      <Icon size={18} className="flex-shrink-0" />
                      {!sidebarCollapsed && (
                        <>
                          <span className="ml-3 flex-1 text-left">{item.title}</span>
                          {activeDropdown === item.id ? (
                            <ChevronDown size={16} className="flex-shrink-0" />
                          ) : (
                            <ChevronRight size={16} className="flex-shrink-0" />
                          )}
                        </>
                      )}
                    </button>
                  ) : (
                    <Link
                      to={item.path}
                      onClick={handleLinkClick}
                      className={`w-full flex items-center ${
                        sidebarCollapsed ? 'justify-center px-2 py-3' : 'px-3 py-2'
                      } rounded-md text-sm font-medium transition-colors duration-200 relative ${
                        active
                          ? 'bg-blue-50 text-blue-700'
                          : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                      } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      title={sidebarCollapsed ? item.title : ''}
                      aria-current={active ? 'page' : undefined}
                    >
                      <span className={`absolute left-0 top-0 h-full w-1 rounded-r ${active ? 'bg-blue-600' : 'bg-transparent'}`} />
                      <Icon size={18} className="flex-shrink-0" />
                      {!sidebarCollapsed && (
                        <span className="ml-3 flex-1 text-left">{item.title}</span>
                      )}
                    </Link>
                  )}

                  {/* Tooltip when collapsed */}
                  {sidebarCollapsed && (
                    <div className="pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-2 hidden group-hover:block">
                      <div className="text-xs text-white bg-gray-900 px-2 py-1 rounded shadow-lg whitespace-nowrap">
                        {item.title}
                      </div>
                    </div>
                  )}

                  {/* Sub Menu Items */}
                  {!sidebarCollapsed && activeDropdown === item.id && item.subItems && (
                    <div id={`menu-${item.id}`} className="ml-6 space-y-1">
                      {item.subItems.map((subItem, index) => (
                        <Link
                          key={index}
                          to={subItem.path}
                          className={`block px-3 py-2 text-sm rounded-md transition-colors duration-150 border-l-2 ${
                            isActive(subItem.path)
                              ? 'text-blue-700 bg-blue-50 border-blue-600'
                              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 border-transparent'
                          }`}
                          onClick={handleLinkClick}
                          aria-current={isActive(subItem.path) ? 'page' : undefined}
                        >
                          <div className="flex flex-col">
                            <span className="font-medium">{subItem.title}</span>
                            {subItem.description && (
                              <span className="text-xs text-gray-500 mt-1">{subItem.description}</span>
                            )}
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </nav>

      </aside>
    </>
  )
}

export default Sidebar
