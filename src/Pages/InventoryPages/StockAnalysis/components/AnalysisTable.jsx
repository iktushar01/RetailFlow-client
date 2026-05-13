import React, { useMemo } from 'react'
import { Activity, Box, Calendar, TrendingUp, Info } from 'lucide-react'

// shadcn/ui components
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/Components/UI/card"
import { Badge } from "@/Components/UI/badge"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/Components/UI/tooltip"

// Your Shared Table
import { SharedTable } from '../../../../Shared/SharedTable/SharedTable'

const AnalysisTable = ({ analysisData, loading }) => {
  const tableColumns = useMemo(() => [
    {
      id: 'product',
      accessorKey: 'productName',
      header: 'Product Details',
      cell: ({ row }) => (
        <div className="flex flex-col gap-0.5">
          <div className="font-bold text-foreground leading-tight">
            {row.original.productName}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-muted-foreground bg-muted px-1.5 rounded">
              {row.original.sku}
            </span>
            <span className="text-[10px] text-muted-foreground italic">
              {row.original.category}
            </span>
          </div>
        </div>
      )
    },
    {
      id: 'totalSold',
      accessorKey: 'totalSold',
      header: () => <div className="text-center">Total Sold</div>,
      cell: ({ row }) => (
        <div className="text-center">
          <div className="text-sm font-bold text-foreground">{row.original.totalSold}</div>
          <div className="text-[10px] text-muted-foreground uppercase tracking-tighter font-medium">units</div>
        </div>
      )
    },
    {
      id: 'lastSaleDate',
      accessorKey: 'lastSaleDate',
      header: () => <div className="text-center">Last Movement</div>,
      cell: ({ row }) => {
        const hasDate = !!row.original.lastSaleDate;
        return (
          <div className="text-center">
            <div className={`text-sm font-medium ${hasDate ? 'text-foreground' : 'text-muted-foreground/50'}`}>
              {hasDate ? new Date(row.original.lastSaleDate).toLocaleDateString() : 'No Activity'}
            </div>
            {row.original.daysSinceLastSale !== null && (
              <div className="text-[10px] text-muted-foreground flex items-center justify-center gap-1">
                <Calendar className="w-3 h-3" />
                {row.original.daysSinceLastSale}d ago
              </div>
            )}
          </div>
        );
      }
    },
    {
      id: 'currentStock',
      accessorKey: 'currentStock',
      header: () => <div className="text-center">Stock Level</div>,
      cell: ({ row }) => (
        <div className="text-center">
          <Badge variant="outline" className="font-mono bg-background shadow-sm border-muted-foreground/20">
            {row.original.currentStock}
          </Badge>
          <div className="text-[10px] text-muted-foreground mt-1 uppercase font-medium">In Hand</div>
        </div>
      )
    },
    {
      id: 'velocity',
      accessorKey: 'velocity',
      header: () => (
        <div className="flex items-center justify-center gap-1">
          Velocity
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="w-3 h-3 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs text-center">Avg. units sold per day</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      ),
      cell: ({ row }) => (
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 font-bold text-primary">
            <TrendingUp className="w-3 h-3" />
            {row.original.velocity.toFixed(2)}
          </div>
          <div className="text-[10px] text-muted-foreground">units / day</div>
        </div>
      )
    },
    {
      id: 'status',
      accessorKey: 'status',
      header: () => <div className="text-center">Status</div>,
      cell: ({ row }) => (
        <div className="flex items-center justify-center gap-2">
          <span className="text-base grayscale-[0.5] group-hover:grayscale-0 transition-all">
            {row.original.statusIcon}
          </span>
          <Badge 
            variant="secondary" 
            className={`text-[10px] font-bold uppercase tracking-tight shadow-sm ${row.original.statusColor}`}
          >
            {row.original.status}
          </Badge>
        </div>
      )
    }
  ], []);

  return (
    <Card className="shadow-sm border-border bg-card animate-in fade-in zoom-in-95 duration-500">
      <CardHeader className="border-b pb-4">
        <CardTitle className="text-lg flex items-center gap-2 font-bold tracking-tight">
          <Activity className="w-5 h-5 text-primary" />
          Stock Movement Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6 px-0 sm:px-6">
        <SharedTable
          data={analysisData}
          columns={tableColumns}
          loading={loading}
          emptyMessage="No stock movement data found for current inventory"
        />
      </CardContent>
    </Card>
  )
}

export default AnalysisTable

