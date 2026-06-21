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
    salesData: { labels: [], data: [] },
    summary: { totalSales: 0, totalAmount: 0 },
  })

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true)
      const [overview, salesData, summary, topProducts, activities, alerts] = await Promise.all([
        dashboardAPI.getOverview(),
        dashboardAPI.getSalesData(timeFilter),
        dashboardAPI.getSummaryForPeriod(timeFilter),
        dashboardAPI.getTopProducts(4, timeFilter),
        dashboardAPI.getRecentActivities(),
        dashboardAPI.getAlerts(),
      ])

      setData({
        ...overview,
        topProducts,
        recentActivities: activities,
        alerts,
        salesData,
        summary,
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
    refetch: fetchDashboardData,
  }
}
