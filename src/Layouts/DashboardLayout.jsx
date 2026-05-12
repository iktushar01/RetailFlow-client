import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../Components/Sidebar/Sidebar'
import Header from '../Components/Header/Header'
import { Footer } from '../Components/Footer/Footer'
import ScrollToTopButton from '../Components/ScrollToTopButton/ScrollToTopButton'
import { Z_INDEX } from '../constants/zIndex'

export const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=DM+Mono:wght@400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; }

        .layout-root {
          height: 100vh;
          overflow: hidden;
          display: flex;
          background: #f8fafc;
          font-family: 'DM Sans', 'Inter', sans-serif;
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
          background: #fff;
          border-bottom: 1px solid #f1f5f9;
          flex-shrink: 0;
        }
        .layout-main {
          flex: 1;
          overflow-y: auto;
          scrollbar-width: thin;
          scrollbar-color: #e2e8f0 transparent;
        }
        .layout-main::-webkit-scrollbar { width: 5px; }
        .layout-main::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 99px;
        }
        .layout-main::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
        .layout-inner {
          padding: 24px;
          padding-bottom: 32px;
          max-width: 1600px;
        }

        /* Page transition */
        .layout-page-enter {
          animation: pageEnter 0.2s ease-out;
        }
        @keyframes pageEnter {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* Scrollbar for sidebar on mobile */
        @media (max-width: 768px) {
          .layout-inner { padding: 16px; }
        }
      `}</style>

      <div className="layout-root">
        {/* Sidebar */}
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Main content */}
        <div className="layout-content-area">
          {/* Sticky header */}
          <div className="layout-header-sticky" style={{ zIndex: Z_INDEX.HEADER }}>
            <Header onMenuClick={() => setSidebarOpen(true)} />
          </div>

          {/* Scrollable page content */}
          <main className="layout-main">
            <div className="layout-inner layout-page-enter">
              <Outlet />
            </div>
          </main>

          {/* Footer */}
          <Footer />

          {/* Scroll to top */}
          <ScrollToTopButton />
        </div>
      </div>
    </>
  )
}