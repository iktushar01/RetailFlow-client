import React, { useState } from 'react'
import Swal from 'sweetalert2'
import { dashboardAPI } from './services/dashboardService'
import { DashboardLoading } from '../../Components/UI/LoadingAnimation'
import { useDashboardData, useDashboardMetrics } from './hooks'
import {
  DashboardHeader,
  MetricsGrid,
  SalesTrendChart,
  StockDistribution,
  TopProducts,
  AlertsSection,
  QuickActions,
  RecentActivities
} from './components'

export const HomePage = () => {
  const [timeFilter, setTimeFilter] = useState('today')
  
  const { data, loading, refreshing, handleRefresh } = useDashboardData(timeFilter)
  const metrics = useDashboardMetrics(data, timeFilter)

  // Configure SweetAlert2 to match Shadcn's aesthetic
  const swalConfig = {
    confirmButtonColor: 'hsl(var(--primary))',
    background: 'hsl(var(--card))',
    color: 'hsl(var(--card-foreground))',
    customClass: {
      popup: 'rounded-xl border border-border shadow-lg',
      confirmButton: 'rounded-md px-4 py-2 text-sm font-medium transition-colors',
    }
  }

  const handleExport = async () => {
    try {
      await dashboardAPI.exportData()
      Swal.fire({
        ...swalConfig,
        icon: 'success',
        title: 'Export Successful',
        text: 'Dashboard data has been exported',
      })
    } catch {
      Swal.fire({
        ...swalConfig,
        icon: 'error',
        title: 'Export Failed',
        text: 'Failed to export dashboard data',
      })
    }
  }

  if (loading) {
    return <DashboardLoading message="Loading dashboard data..." />
  }

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* 
          Container with responsive padding and max-width 
          matching Shadcn dashboard templates 
      */}
      <main className="mx-auto space-y-8 p-4 md:p-8 pt-6">
        
        {/* Top Section: Title & Global Actions */}
        <DashboardHeader
          timeFilter={timeFilter}
          setTimeFilter={setTimeFilter}
          onRefresh={handleRefresh}
          onExport={handleExport}
          refreshing={refreshing}
        />

        {/* High-Level KPIs */}
        <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <MetricsGrid metrics={metrics} />
        </section>

        {/* Primary Data Visuals */}
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <div className="xl:col-span-2">
            <SalesTrendChart data={data} />
          </div>
          <StockDistribution data={data} />
        </div>

        {/* Secondary Insights */}
        <section className="space-y-6">
          <TopProducts data={data} />
          
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <AlertsSection data={data} />
            </div>
            <QuickActions />
          </div>
        </section>

        {/* Audit Trail / Feed */}
        <section className="pb-10">
          <RecentActivities data={data} />
        </section>
      </main>
    </div>
  )
}
