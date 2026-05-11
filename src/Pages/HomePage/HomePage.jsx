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
  
  // Custom hooks for data management
  const { data, loading, refreshing, handleRefresh } = useDashboardData(timeFilter)
  const metrics = useDashboardMetrics(data)

  const handleExport = async () => {
    try {
      await dashboardAPI.exportData('overview')
      Swal.fire({
        icon: 'success',
        title: 'Export Successful',
        text: 'Dashboard data has been exported',
        confirmButtonColor: '#3B82F6'
      })
    } catch {
      Swal.fire({
        icon: 'error',
        title: 'Export Failed',
        text: 'Failed to export dashboard data',
        confirmButtonColor: '#3B82F6'
      })
    }
  }

  if (loading) {
    return <DashboardLoading message="Loading dashboard data..." />
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-slate-50 to-white px-4 py-6">
      <div className="mx-auto space-y-6">
        {/* Header Section */}
        <DashboardHeader
          timeFilter={timeFilter}
          setTimeFilter={setTimeFilter}
          onRefresh={handleRefresh}
          onExport={handleExport}
          refreshing={refreshing}
        />

        {/* Key Metrics */}
        <MetricsGrid metrics={metrics} data={data} />

        {/* Charts & Graphs */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          <SalesTrendChart
            data={data}
            timeFilter={timeFilter}
            setTimeFilter={setTimeFilter}
          />
          <StockDistribution data={data} />
        </div>

        {/* Top Selling Products */}
        <TopProducts data={data} />

        {/* Alerts & Notifications + Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <AlertsSection data={data} />
          <QuickActions />
        </div>

        {/* Recent Activities */}
        <RecentActivities data={data} />
      </div>
    </div>
  )
}
