import React, { useState, useCallback } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../Components/Sidebar/Sidebar'
import Header from '../Components/Header/Header'
import ScrollToTopButton from '../Components/ScrollToTopButton/ScrollToTopButton'
import { Z_INDEX } from '../constants/zIndex'

const MOBILE_BREAKPOINT = 768

export const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const handleMenuToggle = useCallback(() => {
    if (window.innerWidth < MOBILE_BREAKPOINT) {
      setSidebarOpen((prev) => !prev)
      return
    }
    setSidebarCollapsed((prev) => !prev)
  }, [])

  const closeSidebar = useCallback(() => setSidebarOpen(false), [])

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&family=DM+Mono:wght@400;500&display=swap');

        .layout-root {
          height: 100vh;
          overflow: hidden;
          display: flex;
          background: var(--background);
          color: var(--foreground);
          font-family: var(--font-sans, 'DM Sans', sans-serif);
        }
        .layout-content-area {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          min-width: 0;
        }
        .layout-header-sticky {
          position: sticky;
          top: 0;
          flex-shrink: 0;
          background: var(--background);
          border-bottom: 1px solid var(--border);
        }
        .layout-main {
          flex: 1;
          overflow-y: auto;
          scrollbar-width: thin;
          scrollbar-color: var(--border) transparent;
        }
        .layout-main::-webkit-scrollbar { width: 5px; }
        .layout-main::-webkit-scrollbar-thumb {
          background: var(--border);
          border-radius: 99px;
        }
        .layout-inner {
          padding: 24px;
          padding-bottom: 32px;
        }
        .layout-page-enter { animation: pageEnter 0.2s ease-out; }
        @keyframes pageEnter {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @media (max-width: 768px) {
          .layout-inner { padding: 16px; }
        }
      `}</style>

      <div className="layout-root">
        <Sidebar
          isOpen={sidebarOpen}
          isCollapsed={sidebarCollapsed}
          onClose={closeSidebar}
        />

        <div className="layout-content-area">
          <div className="layout-header-sticky" style={{ zIndex: Z_INDEX.HEADER }}>
            <Header onMenuClick={handleMenuToggle} />
          </div>

          <main className="layout-main">
            <div className="layout-inner layout-page-enter">
              <Outlet />
            </div>
          </main>

     
          <ScrollToTopButton />
        </div>
      </div>
    </>
  )
}
