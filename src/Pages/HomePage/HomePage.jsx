import React, { useState } from 'react'
import { notify } from '../../utils/notifications'
import { dashboardAPI } from './services/dashboardService'
import { DashboardPageSkeleton } from '../../Components/UI/PageSkeleton'
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

  const handleExport = async () => {
    try {
      await dashboardAPI.exportData()
      notify.success('Export Successful', 'Dashboard data has been exported')
    } catch {
      notify.error('Export Failed', 'Failed to export dashboard data')
    }
  }

  if (loading) {
    return <DashboardPageSkeleton />
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
