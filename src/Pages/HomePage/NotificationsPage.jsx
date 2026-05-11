import React, { useState, useEffect } from 'react'
import { Bell, AlertTriangle, Clock, CreditCard, Package, TrendingUp, X, CheckCircle, Info, AlertCircle, RefreshCw } from 'lucide-react'
import Swal from 'sweetalert2'
import { dashboardAPI } from './services/dashboardService'
import Button from '../../Components/UI/Button'
import { DashboardLoading } from '../../Components/UI/LoadingAnimation'

export const NotificationsPage = () => {
  const [loading, setLoading] = useState(true)
  const [notifications, setNotifications] = useState([])
  const [filter, setFilter] = useState('all') // all, unread, alerts, info
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    fetchNotifications()
  }, [])

  const fetchNotifications = async () => {
    try {
      setLoading(true)
      const [alerts, activities] = await Promise.all([
        dashboardAPI.getAlerts(),
        dashboardAPI.getRecentActivities()
      ])

      // Combine alerts and activities into notifications
      const allNotifications = [
        ...alerts.map(alert => ({
          id: alert.id,
          type: 'alert',
          priority: alert.severity,
          title: alert.title,
          message: alert.message,
          timestamp: alert.timestamp,
          read: false,
          icon: getNotificationIcon(alert.icon),
          color: getNotificationColor(alert.severity)
        })),
        ...activities.slice(0, 10).map(activity => ({
          id: activity.id,
          type: 'activity',
          priority: 'info',
          title: activity.title,
          message: activity.description,
          timestamp: activity.timestamp,
          read: false,
          icon: getActivityIcon(activity.type),
          color: 'text-blue-600 bg-blue-50'
        }))
      ]

      // Sort by timestamp (newest first)
      allNotifications.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      
      setNotifications(allNotifications)
    } catch (error) {
      console.error('Error fetching notifications:', error)
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to load notifications',
        confirmButtonColor: '#3B82F6'
      })
    } finally {
      setLoading(false)
    }
  }

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'alert-triangle': return AlertTriangle
      case 'clock': return Clock
      case 'credit-card': return CreditCard
      default: return Bell
    }
  }

  const getActivityIcon = (type) => {
    switch (type) {
      case 'sale': return TrendingUp
      case 'purchase': return Package
      case 'grn': return Package
      default: return Info
    }
  }

  const getNotificationColor = (severity) => {
    switch (severity) {
      case 'high': return 'text-red-600 bg-red-50'
      case 'medium': return 'text-amber-600 bg-amber-50'
      case 'low': return 'text-blue-600 bg-blue-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchNotifications()
    setRefreshing(false)
  }

  const markAsRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    )
  }

  const deleteNotification = (notificationId) => {
    setNotifications(prev => prev.filter(notif => notif.id !== notificationId))
  }

  const filteredNotifications = notifications.filter(notif => {
    switch (filter) {
      case 'unread': return !notif.read
      case 'alerts': return notif.type === 'alert'
      case 'info': return notif.type === 'activity'
      default: return true
    }
  })

  const unreadCount = notifications.filter(notif => !notif.read).length

  if (loading) {
    return <DashboardLoading message="Loading notifications..." />
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-slate-50 to-white px-4 py-6">
      <div className=" mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Notifications</h1>
            <p className="text-sm text-gray-500 mt-1">
              {unreadCount} unread notifications out of {notifications.length} total
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={handleRefresh}
              disabled={refreshing}
              loading={refreshing}
              variant="secondary"
              size="sm"
            >
              <div className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4" />
                {refreshing ? 'Refreshing...' : 'Refresh'}
              </div>
            </Button>
            {unreadCount > 0 && (
              <Button
                onClick={markAllAsRead}
                variant="primary"
                size="sm"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Mark All Read
                </div>
              </Button>
            )}
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1 rounded-lg bg-white/70 backdrop-blur p-1 ring-1 ring-slate-200/70">
          {[
            { key: 'all', label: 'All', count: notifications.length },
            { key: 'unread', label: 'Unread', count: unreadCount },
            { key: 'alerts', label: 'Alerts', count: notifications.filter(n => n.type === 'alert').length },
            { key: 'info', label: 'Activities', count: notifications.filter(n => n.type === 'activity').length }
          ].map(({ key, label, count }) => (
            <Button
              key={key}
              onClick={() => setFilter(key)}
              variant={filter === key ? 'primary' : 'ghost'}
              size="sm"
              className="px-4 py-2 text-sm"
            >
              <div className="flex items-center gap-2">
                {label} ({count})
              </div>
            </Button>
          ))}
        </div>

        {/* Notifications List */}
        <div className="space-y-3">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notification) => {
              const IconComponent = notification.icon
              return (
                <div
                  key={notification.id}
                  className={`rounded-xl ring-1 ring-slate-200/70 p-4 transition-all hover:shadow-md ${
                    notification.read ? 'bg-white/50' : 'bg-white shadow-sm'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${notification.color}`}>
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className={`font-semibold ${notification.read ? 'text-gray-600' : 'text-gray-900'}`}>
                            {notification.title}
                          </h3>
                          <p className={`text-sm mt-1 ${notification.read ? 'text-gray-500' : 'text-gray-700'}`}>
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-400 mt-2">
                            {new Date(notification.timestamp).toLocaleString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          {!notification.read && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          )}
                          <Button
                            onClick={() => markAsRead(notification.id)}
                            variant="ghost"
                            size="sm"
                            className="p-1 min-w-0 w-8 h-8"
                            title="Mark as read"
                          >
                            <div className="flex items-center gap-2">
                              <CheckCircle className="w-4 h-4" />
                            </div>
                          </Button>
                          <Button
                            onClick={() => deleteNotification(notification.id)}
                            variant="ghost"
                            size="sm"
                            className="p-1 min-w-0 w-8 h-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                            title="Delete notification"
                          >
                            <div className="flex items-center gap-2">
                              <X className="w-4 h-4" />
                            </div>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })
          ) : (
            <div className="text-center py-12">
              <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No notifications</h3>
              <p className="text-gray-500">
                {filter === 'all' 
                  ? "You're all caught up! No notifications to show."
                  : `No ${filter} notifications found.`
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
