import React, { useMemo } from 'react'
import { BarChart3, ArrowUpRight, TrendingUp, Calendar } from 'lucide-react'

// shadcn/ui components
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/Components/ui/card"
import { Badge } from "@/Components/ui/badge"

// Your Shared Table
import { SharedTable } from '../../../../Shared/SharedTable/SharedTable'

const MonthlyBreakdownTable = ({ 
  monthlyBreakdown, 
  loading, 
  filters, 
  formatCurrency, 
  getProfitColor, 
  getProfitIcon 
}) => {
  
  // Table Columns Definition
  const tableColumns = useMemo(() => [
    {
      id: 'month',
      accessorKey: 'monthName',
      header: 'Month',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="font-semibold text-foreground">{row.original.monthName}</span>
        </div>
      )
    },
    {
      id: 'sales',
      accessorKey: 'sales',
      header: () => <div className="text-right">Total Sales</div>,
      cell: ({ row }) => (
        <div className="text-right font-medium text-foreground">
          {formatCurrency(row.original.sales)}
        </div>
      )
    },
    {
      id: 'cogs',
      accessorKey: 'cogs',
      header: () => <div className="text-right">COGS</div>,
      cell: ({ row }) => (
        <div className="text-right text-muted-foreground">
          {formatCurrency(row.original.cogs)}
        </div>
      )
    },
    {
      id: 'expenses',
      accessorKey: 'expenses',
      header: () => <div className="text-right">Expenses</div>,
      cell: ({ row }) => (
        <div className="text-right text-destructive/80 italic">
          {formatCurrency(row.original.expenses)}
        </div>
      )
    },
    {
      id: 'profit',
      accessorKey: 'profit',
      header: () => <div className="text-right">Net Profit</div>,
      cell: ({ row }) => {
        const item = row.original
        const ProfitIcon = getProfitIcon(item.profit)
        const isPositive = item.profit >= 0

        return (
          <div className="flex justify-end">
            <Badge 
              variant={isPositive ? "outline" : "destructive"} 
              className={`font-mono gap-1 px-2 py-1 ${isPositive ? 'border-green-200 bg-green-50/50 text-green-700 dark:bg-green-950/20 dark:text-green-400' : ''}`}
            >
              <ProfitIcon className="w-3 h-3" />
              {formatCurrency(item.profit)}
            </Badge>
          </div>
        )
      }
    }
  ], [formatCurrency, getProfitColor, getProfitIcon])

  return (
    <Card className="shadow-sm border-border bg-card animate-in fade-in duration-700">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6 border-b">
        <div className="space-y-1">
          <CardTitle className="text-xl flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary" />
            Monthly Breakdown
          </CardTitle>
          <CardDescription>
            Detailed Profit & Loss statement for the year <strong>{filters.year}</strong>
          </CardDescription>
        </div>
        
        {/* Quick Summary Badge for the header */}
        <div className="hidden md:block">
          <Badge variant="secondary" className="font-normal text-xs">
            <TrendingUp className="w-3 h-3 mr-1 text-primary" />
            Accrual Basis Accounting
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-6 px-0 md:px-6">
        <div className="rounded-md">
          <SharedTable
            data={monthlyBreakdown}
            columns={tableColumns}
            loading={loading}
            emptyMessage="No P&L data available for this period"
          />
        </div>
        
        {/* Optional Footer Legend */}
        <div className="mt-4 px-6 md:px-0 flex items-center gap-4 text-[10px] text-muted-foreground uppercase tracking-widest">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-green-500" /> Profit
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-destructive" /> Loss
          </div>
          <div className="ml-auto italic normal-case tracking-normal">
            All values in BDT (৳)
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default MonthlyBreakdownTable
