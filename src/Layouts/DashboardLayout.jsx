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
    <div className="h-screen overflow-hidden bg-gray-50 flex">
      {/* Sidebar */}
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* Header (sticky) */}
        <div className="sticky top-0 bg-white border-b border-gray-200" style={{ zIndex: Z_INDEX.HEADER }}>
          <Header onMenuClick={() => setSidebarOpen(true)} />
        </div>
        
        {/* Main Content */}
        <main className="flex-1 overflow-y-auto relative">
          <div className="p-4 md:p-6 pb-20">
            <Outlet />
          </div>
        </main>
        <Footer></Footer>
        
        {/* Scroll to Top Button */}
        <ScrollToTopButton />
      </div>
    </div>
  )
}
