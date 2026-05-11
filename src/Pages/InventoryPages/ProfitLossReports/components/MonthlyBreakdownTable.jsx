import React from 'react'
import { BarChart3 } from 'lucide-react'
import { SharedTable } from '../../../../Shared/SharedTable/SharedTable'

const MonthlyBreakdownTable = ({ 
  monthlyBreakdown, 
  loading, 
  filters, 
  formatCurrency, 
  getProfitColor, 
  getProfitIcon 
}) => {
  const tableColumns = [
    {
      id: 'month',
      accessorKey: 'monthName',
      header: 'Month',
      cell: ({ row }) => (
        <div className="font-medium text-gray-900">{row.original.monthName}</div>
      )
    },
    {
      id: 'sales',
      accessorKey: 'sales',
      header: 'Total Sales',
      cell: ({ row }) => (
        <div className="text-right">
          <div className="font-medium text-gray-900">{formatCurrency(row.original.sales)}</div>
        </div>
      )
    },
    {
      id: 'cogs',
      accessorKey: 'cogs',
      header: 'COGS',
      cell: ({ row }) => (
        <div className="text-right">
          <div className="font-medium text-gray-900">{formatCurrency(row.original.cogs)}</div>
        </div>
      )
    },
    {
      id: 'expenses',
      accessorKey: 'expenses',
      header: 'Expenses',
      cell: ({ row }) => (
        <div className="text-right">
          <div className="font-medium text-gray-900">{formatCurrency(row.original.expenses)}</div>
        </div>
      )
    },
    {
      id: 'profit',
      accessorKey: 'profit',
      header: 'Net Profit',
      cell: ({ row }) => {
        const item = row.original
        const ProfitIcon = getProfitIcon(item.profit)
        return (
          <div className="text-right">
            <div className={`font-medium flex items-center justify-end ${getProfitColor(item.profit)}`}>
              <ProfitIcon className="w-4 h-4 mr-1" />
              {formatCurrency(item.profit)}
            </div>
          </div>
        )
      }
    }
  ]

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="mb-6 pb-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <BarChart3 className="w-5 h-5 mr-2 text-yellow-600" />
          Monthly Breakdown ({filters.year})
        </h3>
      </div>
      <SharedTable
        data={monthlyBreakdown}
        columns={tableColumns}
        loading={loading}
        emptyMessage="No P&L data available"
      />
    </div>
  )
}

export default MonthlyBreakdownTable
