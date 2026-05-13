import React, { useState, useEffect, useCallback } from 'react'
import { 
  Bell, AlertTriangle, Clock, CreditCard, Package, TrendingUp, 
  X, CheckCircle, Info, RefreshCw, Inbox, Trash2, Check 
} from 'lucide-react'

// shadcn/ui imports
import { Button } from "@/Components/ui/button"
import { Card, CardContent } from "@/Components/ui/card"
import { Badge } from "@/Components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/Components/ui/tabs"
import { ScrollArea } from "@/Components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/Components/ui/tooltip"

import { dashboardAPI } from './services/dashboardService'
import { DashboardLoading } from '../../Components/UI/LoadingAnimation'

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
      console.error('Notification Sync Error:', error)
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

  if (loading) return <DashboardLoading message="Syncing notifications..." />

  return (
    <div className="w-full  mx-auto px-4 py-6 md:py-8 space-y-6 md:space-y-8 animate-in fade-in duration-500">
      
      {/* HEADER SECTION - Stacked on mobile, side-by-side on md+ */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 md:gap-6">
        <div className="space-y-1 w-full">
          <div className="flex items-center gap-2 text-primary font-bold uppercase tracking-[0.2em] text-[10px]">
            <Inbox className="w-3 h-3" />
            Communication Hub
          </div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tighter italic leading-none">
            NOTIFICATIONS<span className="text-muted-foreground/40 ml-2">CENTER</span>
          </h1>
          <p className="text-muted-foreground text-xs md:text-sm font-medium">
            You have <span className="text-foreground font-bold">{unreadCount} unread</span> messages.
          </p>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh} 
            disabled={refreshing} 
            className="flex-1 md:flex-none rounded-xl font-bold uppercase text-[10px] tracking-widest h-9"
          >
            <RefreshCw className={`w-3.5 h-3.5 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Sync
          </Button>
          {unreadCount > 0 && (
            <Button 
              size="sm" 
              onClick={markAllAsRead} 
              className="flex-1 md:flex-none rounded-xl font-bold uppercase text-[10px] tracking-widest h-9 shadow-lg shadow-primary/20"
            >
              <Check className="w-3.5 h-3.5 mr-2" />
              Mark Read
            </Button>
          )}
        </div>
      </div>

      {/* FILTER TABS - Scrollable on very small screens */}
      <Tabs defaultValue="all" className="w-full" onValueChange={setFilter}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div className="overflow-x-auto pb-1 sm:pb-0">
            <TabsList className="bg-muted/50 p-1 rounded-xl border inline-flex">
              <TabsTrigger value="all" className="rounded-lg px-4 md:px-6 font-bold text-[10px] md:text-xs uppercase tracking-wider">All</TabsTrigger>
              <TabsTrigger value="unread" className="rounded-lg px-4 md:px-6 font-bold text-[10px] md:text-xs uppercase tracking-wider">Unread</TabsTrigger>
              <TabsTrigger value="alerts" className="rounded-lg px-4 md:px-6 font-bold text-[10px] md:text-xs uppercase tracking-wider">Alerts</TabsTrigger>
              <TabsTrigger value="info" className="rounded-lg px-4 md:px-6 font-bold text-[10px] md:text-xs uppercase tracking-wider">Activity</TabsTrigger>
            </TabsList>
          </div>
          
          <Badge variant="outline" className="hidden sm:inline-flex rounded-full px-3 py-1 font-mono text-[10px] opacity-60">
            LOG_COUNT: {notifications.length}
          </Badge>
        </div>

        <Card className="rounded-2xl md:rounded-[2rem] border-muted/60 shadow-xl shadow-black/[0.02] overflow-hidden">
          <CardContent className="p-0">
            <ScrollArea className="h-[65vh] md:h-[60vh] w-full">
              {filteredNotifications.length > 0 ? (
                <div className="divide-y divide-border/40">
                  {filteredNotifications.map((notif) => {
                    const Icon = notif.icon
                    return (
                      <div 
                        key={notif.id}
                        className={`group relative flex flex-col sm:flex-row items-start gap-3 md:gap-4 p-4 md:p-5 transition-all hover:bg-muted/30 ${!notif.read ? 'bg-primary/[0.01]' : 'opacity-70'}`}
                      >
                        {/* Unread Indicator */}
                        {!notif.read && <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary sm:block" />}

                        <div className="flex w-full gap-3 md:gap-4">
                          {/* Icon */}
                          <div className={`p-2.5 md:p-3 rounded-xl md:rounded-2xl shrink-0 h-fit ${notif.color}`}>
                            <Icon className="w-4 h-4 md:w-5 md:h-5" />
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0 space-y-1">
                            <div className="flex items-center justify-between gap-2">
                              <h3 className={`text-xs md:text-sm font-bold tracking-tight uppercase truncate ${notif.read ? 'text-muted-foreground' : 'text-foreground'}`}>
                                {notif.title}
                              </h3>
                              <span className="shrink-0 text-[9px] md:text-[10px] font-bold text-muted-foreground uppercase font-mono">
                                {new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            
                            <p className="text-xs md:text-sm text-muted-foreground leading-relaxed line-clamp-2 sm:line-clamp-none">
                              {notif.message}
                            </p>

                            <div className="flex items-center justify-between sm:justify-start gap-3 pt-2">
                               <Badge variant="secondary" className="text-[8px] md:text-[9px] font-black uppercase tracking-tighter px-2 py-0 h-5 rounded-md">
                                  {notif.type}
                               </Badge>
                               <span className="text-[9px] md:text-[10px] text-muted-foreground/50 font-medium italic">
                                 {new Date(notif.timestamp).toLocaleDateString()}
                               </span>
                            </div>
                          </div>

                          {/* Desktop Actions - Visible on hover */}
                          <div className="hidden lg:flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                            <ActionButtons 
                               notif={notif} 
                               markAsRead={markAsRead} 
                               deleteNotification={deleteNotification} 
                            />
                          </div>
                        </div>

                        {/* Mobile Actions - Persistent on small screens */}
                        <div className="flex lg:hidden w-full justify-end items-center gap-2 mt-2 pt-2 border-t border-border/20">
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

// Helper component for action buttons to avoid repetition
const ActionButtons = ({ notif, markAsRead, deleteNotification, isMobile = false }) => (
  <TooltipProvider delayDuration={0}>
    {!notif.read && (
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            variant={isMobile ? "secondary" : "ghost"} 
            size="icon" 
            onClick={() => markAsRead(notif.id)} 
            className="h-8 w-8 rounded-lg text-primary"
          >
            <CheckCircle className="w-4 h-4" />
            {isMobile && <span className="sr-only">Mark Read</span>}
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
          className="h-8 w-8 rounded-lg text-destructive"
        >
          <Trash2 className="w-4 h-4" />
          {isMobile && <span className="sr-only">Delete</span>}
        </Button>
      </TooltipTrigger>
      {!isMobile && <TooltipContent>Delete log</TooltipContent>}
    </Tooltip>
  </TooltipProvider>
)

const EmptyState = ({ filter }) => (
  <div className="flex flex-col items-center justify-center py-16 md:py-24 text-center px-6">
    <div className="p-4 md:p-6 bg-muted/50 rounded-full mb-4">
      <Bell className="w-8 h-8 md:w-12 md:h-12 text-muted-foreground/30" />
    </div>
    <h3 className="text-base md:text-lg font-bold italic tracking-tight uppercase">Registry Clear</h3>
    <p className="text-xs md:text-sm text-muted-foreground max-w-xs mx-auto">
      {filter === 'all' 
        ? "No system logs found in the current buffer." 
        : `No ${filter} logs found.`}
    </p>
  </div>
)

export default NotificationsPage
