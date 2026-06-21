import React, { useState, useEffect, useCallback } from 'react'
import { 
  Bell, AlertTriangle, Clock, CreditCard, Package, TrendingUp, 
  CheckCircle, Info, RefreshCw, Trash2, Check 
} from 'lucide-react'

import { Button } from "@/Components/UI/button"
import { Card, CardContent } from "@/Components/UI/card"
import { Badge } from "@/Components/UI/badge"
import { Tabs, TabsList, TabsTrigger } from "@/Components/UI/tabs"
import { ScrollArea } from "@/Components/UI/scroll-area"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/Components/UI/tooltip"

import { dashboardAPI } from './services/dashboardService'
import { NotificationsPageSkeleton } from '../../Components/UI/PageSkeleton'

const NotificationsPage = () => {
  const [loading, setLoading] = useState(true)
  const [notifications, setNotifications] = useState([])
  const [filter, setFilter] = useState('all')
  const [refreshing, setRefreshing] = useState(false)

  const fetchNotifications = useCallback(async (isSilent = false) => {
    try {
      if (!isSilent) setLoading(true)
      const [alerts, activities] = await Promise.all([
        dashboardAPI.getAlerts(),
        dashboardAPI.getRecentActivities()
      ])

      const allNotifications = [
        ...alerts.map(alert => ({
          ...alert,
          type: 'alert',
          priority: alert.severity,
          icon: getNotificationIcon(alert.icon),
          color: getSeverityStyles(alert.severity)
        })),
        ...activities.slice(0, 15).map(activity => ({
          ...activity,
          type: 'activity',
          priority: 'info',
          icon: getActivityIcon(activity.type),
          color: "bg-blue-500/10 text-blue-600 dark:text-blue-400"
        }))
      ]

      allNotifications.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      setNotifications(allNotifications)
    } catch (error) {
      console.error('Failed to load notifications:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchNotifications()
  }, [fetchNotifications])

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
      case 'purchase': 
      case 'grn': return Package
      default: return Info
    }
  }

  const getSeverityStyles = (severity) => {
    switch (severity) {
      case 'high': return 'bg-red-500/10 text-red-600 dark:text-red-400'
      case 'medium': return 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
      default: return 'bg-slate-500/10 text-slate-600 dark:text-slate-400'
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchNotifications(true)
    setRefreshing(false)
  }

  const markAsRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
  }

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const filteredNotifications = notifications.filter(notif => {
    if (filter === 'unread') return !notif.read
    if (filter === 'alerts') return notif.type === 'alert'
    if (filter === 'info') return notif.type === 'activity'
    return true
  })

  const unreadCount = notifications.filter(n => !n.read).length

  if (loading) return <NotificationsPageSkeleton />

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b pb-6">
        <div className="space-y-1.5">
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Notifications</h1>
          <p className="text-muted-foreground text-sm md:text-base">
            {unreadCount > 0
              ? `You have ${unreadCount} unread notification${unreadCount === 1 ? '' : 's'}.`
              : 'All caught up. No unread notifications.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          {unreadCount > 0 && (
            <Button size="sm" onClick={markAllAsRead}>
              <Check className="w-4 h-4 mr-2" />
              Mark all as read
            </Button>
          )}
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full" onValueChange={setFilter}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="unread">Unread</TabsTrigger>
            <TabsTrigger value="alerts">Alerts</TabsTrigger>
            <TabsTrigger value="info">Activity</TabsTrigger>
          </TabsList>

          <span className="text-sm text-muted-foreground">
            {notifications.length} total
          </span>
        </div>

        <Card className="overflow-hidden border shadow-none">
          <CardContent className="p-0">
            <ScrollArea className="h-[65vh] md:h-[60vh] w-full">
              {filteredNotifications.length > 0 ? (
                <div className="divide-y divide-border">
                  {filteredNotifications.map((notif) => {
                    const Icon = notif.icon
                    return (
                      <div
                        key={notif.id}
                        className={`group relative flex flex-col sm:flex-row items-start gap-3 p-4 md:p-5 transition-colors hover:bg-muted/30 ${!notif.read ? 'bg-muted/20' : ''}`}
                      >
                        {!notif.read && (
                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />
                        )}

                        <div className="flex w-full gap-3 md:gap-4">
                          <div className={`p-2.5 rounded-lg shrink-0 h-fit ${notif.color}`}>
                            <Icon className="w-4 h-4 md:w-5 md:h-5" />
                          </div>

                          <div className="flex-1 min-w-0 space-y-1">
                            <div className="flex items-center justify-between gap-2">
                              <h3 className={`text-sm font-medium truncate ${notif.read ? 'text-muted-foreground' : 'text-foreground'}`}>
                                {notif.title}
                              </h3>
                              <span className="shrink-0 text-xs text-muted-foreground">
                                {new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>

                            <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 sm:line-clamp-none">
                              {notif.message}
                            </p>

                            <div className="flex items-center gap-3 pt-1">
                              <Badge variant="secondary" className="text-xs capitalize">
                                {notif.type}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {new Date(notif.timestamp).toLocaleDateString()}
                              </span>
                            </div>
                          </div>

                          <div className="hidden lg:flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                            <ActionButtons
                              notif={notif}
                              markAsRead={markAsRead}
                              deleteNotification={deleteNotification}
                            />
                          </div>
                        </div>

                        <div className="flex lg:hidden w-full justify-end items-center gap-2 pt-2 border-t">
                          <ActionButtons
                            notif={notif}
                            markAsRead={markAsRead}
                            deleteNotification={deleteNotification}
                            isMobile
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <EmptyState filter={filter} />
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </Tabs>
    </div>
  )
}

const ActionButtons = ({ notif, markAsRead, deleteNotification, isMobile = false }) => (
  <TooltipProvider delayDuration={0}>
    {!notif.read && (
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={isMobile ? "secondary" : "ghost"}
            size="icon"
            onClick={() => markAsRead(notif.id)}
            className="h-8 w-8"
          >
            <CheckCircle className="w-4 h-4" />
            {isMobile && <span className="sr-only">Mark as read</span>}
          </Button>
        </TooltipTrigger>
        {!isMobile && <TooltipContent>Mark as read</TooltipContent>}
      </Tooltip>
    )}
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant={isMobile ? "secondary" : "ghost"}
          size="icon"
          onClick={() => deleteNotification(notif.id)}
          className="h-8 w-8 text-destructive"
        >
          <Trash2 className="w-4 h-4" />
          {isMobile && <span className="sr-only">Delete</span>}
        </Button>
      </TooltipTrigger>
      {!isMobile && <TooltipContent>Delete</TooltipContent>}
    </Tooltip>
  </TooltipProvider>
)

const EmptyState = ({ filter }) => (
  <div className="flex flex-col items-center justify-center py-16 text-center px-6">
    <div className="p-4 bg-muted/50 rounded-full mb-4">
      <Bell className="w-10 h-10 text-muted-foreground/40" />
    </div>
    <h3 className="text-base font-medium">No notifications</h3>
    <p className="text-sm text-muted-foreground max-w-xs mt-1">
      {filter === 'all'
        ? 'There are no notifications to show right now.'
        : `No ${filter} notifications found.`}
    </p>
  </div>
)

export default NotificationsPage
