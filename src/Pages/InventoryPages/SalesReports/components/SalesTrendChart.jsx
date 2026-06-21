import React, { useMemo } from 'react'
import { TrendingUp, ArrowUpRight, Calendar, Calculator } from 'lucide-react'
import { LineChart } from '../../../../Shared/Charts'

const SalesTrendChart = ({ salesData = [], analyticsData = null }) => {
  const chartData = useMemo(() => {
    if (analyticsData?.labels?.length > 0) {
      const revenue = analyticsData.revenue || analyticsData.data || []
      const salesCount = analyticsData.salesCount || []

      return analyticsData.labels.map((label, index) => ({
        day: label,
        sales: salesCount[index] || 0,
        revenue: revenue[index] || 0,
      }))
    }

    if (!salesData || salesData.length === 0) return []

    const last7Days = []
    const today = new Date()
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      const daySales = salesData.filter(
        (sale) => new Date(sale.createdAt || sale.date).toDateString() === date.toDateString()
      )
      const totalSales = daySales.reduce(
        (sum, sale) => sum + (sale.grandTotal || sale.totalAmount || 0),
        0
      )
      last7Days.push({
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        sales: daySales.length,
        revenue: Math.round(totalSales),
      })
    }
    return last7Days
  }, [salesData, analyticsData])

  const stats = useMemo(() => {
    const total = chartData.reduce((sum, d) => sum + d.revenue, 0)
    const txns = chartData.reduce((sum, d) => sum + d.sales, 0)
    const best = chartData.reduce(
      (prev, curr) => (curr.revenue > prev.revenue ? curr : prev),
      chartData[0] || {}
    )
    const growth =
      chartData.length >= 2
        ? ((chartData[chartData.length - 1].revenue - chartData[0].revenue) /
            (chartData[0].revenue || 1)) *
          100
        : 0

    return { total, txns, best, growth, avg: Math.round(total / (chartData.length || 1)) }
  }, [chartData])

  return (
    <div className="bg-card rounded-xl shadow-sm border border-border p-6 overflow-hidden relative">
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />

      <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-1.5 bg-primary/10 rounded-md">
              <TrendingUp className="w-4 h-4 text-primary" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Performance Overview
            </span>
          </div>
          <h3 className="text-xl font-extrabold text-foreground tracking-tight">Sales Trend Analytics</h3>
        </div>

        <div className="flex flex-wrap gap-4 lg:gap-8">
          <StatMini label="Total Revenue" value={`৳${stats.total.toLocaleString()}`} color="text-emerald-600" />
          <StatMini label="Average Daily" value={`৳${stats.avg.toLocaleString()}`} color="text-primary" />
          <StatMini
            label="Best Performance"
            value={stats.best.day || 'N/A'}
            subValue={`৳${stats.best.revenue?.toLocaleString() || 0}`}
            color="text-purple-600"
          />
        </div>
      </div>

      <div className="bg-muted/30 rounded-xl border border-border/50 p-4 mb-6">
        <LineChart
          embedded
          data={chartData}
          lines={[
            { dataKey: 'revenue', stroke: 'hsl(var(--chart-1))', name: 'Revenue (BDT)', strokeWidth: 3 },
            { dataKey: 'sales', stroke: 'hsl(var(--chart-2))', name: 'Transactions', strokeWidth: 2 },
          ]}
          xAxisKey="day"
          height={300}
          showGrid
          showLegend
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard icon={ReceiptIcon} label="Transactions" value={stats.txns} />
        <MetricCard
          icon={Calculator}
          label="Avg Order"
          value={`৳${stats.txns > 0 ? Math.round(stats.total / stats.txns).toLocaleString() : 0}`}
        />
        <MetricCard
          icon={ArrowUpRight}
          label="Weekly Growth"
          value={`${Math.round(stats.growth)}%`}
          valueClass={stats.growth >= 0 ? 'text-emerald-600' : 'text-destructive'}
        />
        <MetricCard icon={Calendar} label="Peak Day" value={stats.best.day || 'N/A'} valueClass="text-purple-600" />
      </div>
    </div>
  )
}

const StatMini = ({ label, value, subValue, color }) => (
  <div className="text-left lg:text-right">
    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-0.5">{label}</p>
    <p className={`text-sm font-extrabold ${color}`}>{value}</p>
    {subValue && <p className="text-[10px] text-muted-foreground italic">{subValue}</p>}
  </div>
)

const MetricCard = ({ icon: Icon, label, value, valueClass = 'text-foreground' }) => (
  <div className="flex flex-col items-center justify-center p-4 bg-muted/50 rounded-xl border border-border/40 hover:bg-muted transition-colors">
    <Icon className="w-4 h-4 text-muted-foreground/60 mb-2" />
    <p className="text-[10px] font-bold uppercase tracking-tighter text-muted-foreground mb-1">{label}</p>
    <p className={`text-base font-black tabular-nums ${valueClass}`}>{value}</p>
  </div>
)

const ReceiptIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z" />
    <path d="M16 8h-6" />
    <path d="M16 12h-9" />
    <path d="M15 16h-6" />
  </svg>
)

export default SalesTrendChart
