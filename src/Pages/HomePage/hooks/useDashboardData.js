import { useState, useEffect, useCallback } from 'react'
import { dashboardAPI } from '../services/dashboardService'

export const useDashboardData = (timeFilter) => {
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [data, setData] = useState({
    sales: [],
    inventory: [],
    products: [],
    suppliers: [],
    lowStock: [],
    topProducts: [],
    recentActivities: [],
    alerts: [],
    salesData: { labels: [], data: [] }
  })

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true)
      const [overview, salesData, topProducts, activities, alerts] = await Promise.all([
        dashboardAPI.getOverview(),
        dashboardAPI.getSalesData(timeFilter),
        dashboardAPI.getTopProducts(4),
        dashboardAPI.getRecentActivities(),
        dashboardAPI.getAlerts()
      ])

      console.log('Dashboard data fetched:', {
        overview,
        salesData,
        topProducts,
        activities,
        alerts
      })
      
      console.log('Sales data structure:', {
        hasLabels: !!salesData.labels,
        labelsLength: salesData.labels?.length,
        hasData: !!salesData.data,
        dataLength: salesData.data?.length,
        hasDatasets: !!salesData.datasets,
        datasetsLength: salesData.datasets?.length,
        fullSalesData: salesData
      })

      setData({
        ...overview,
        topProducts,
        recentActivities: activities,
        alerts,
        salesData
      })
    } catch (err) {
      console.error('Error fetching dashboard data:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }, [timeFilter])

  useEffect(() => {
    fetchDashboardData()
  }, [fetchDashboardData])

  const handleRefresh = async () => {
    setRefreshing(true)
    try {
      await fetchDashboardData()
    } finally {
      setRefreshing(false)
    }
  }

  return {
    data,
    loading,
    refreshing,
    handleRefresh,
    refetch: fetchDashboardData
  }
}
