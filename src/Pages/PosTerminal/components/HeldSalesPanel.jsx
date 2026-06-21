import React, { useCallback, useEffect, useState } from 'react'
import { Clock, Play, Trash2, RefreshCw, ChevronDown } from 'lucide-react'
import { notify } from '@/utils/notifications'
import { confirmDialog } from '@/utils/confirmDialog'
import { Button } from '@/Components/UI/button'
import { Badge } from '@/Components/UI/badge'
import { ScrollArea } from '@/Components/UI/scroll-area'
import { salesAPI } from '../services/posService'
import { formatCurrency } from '../utils/posHelpers'
import { cn } from '@/lib/utils'

const HeldSalesPanel = ({ onResume, onRefresh }) => {
  const [heldSales, setHeldSales] = useState([])
  const [loading, setLoading] = useState(false)
  const [expanded, setExpanded] = useState(false)

  const fetchHeld = useCallback(async () => {
    setLoading(true)
    try {
      const sales = await salesAPI.getAll({ status: 'Hold' })
      setHeldSales(sales || [])
    } catch (error) {
      console.error('Failed to load held sales:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchHeld()
  }, [fetchHeld, onRefresh])

  const handleDelete = async (sale) => {
    const confirmed = await confirmDialog({
      title: 'Delete held sale?',
      description: `Remove ${sale.invoiceNo}?`,
      confirmText: 'Delete',
      variant: 'destructive',
    })
    if (!confirmed) return

    try {
      await salesAPI.delete(sale._id)
      await fetchHeld()
      notify.success('Deleted', undefined, { duration: 1200 })
    } catch (error) {
      notify.error('Error', error.message || 'Failed to delete held sale')
    }
  }

  if (heldSales.length === 0 && !loading) {
    return null
  }

  return (
    <div className="shrink-0 border-b bg-muted/10 px-3 py-2 sm:px-4">
      <button
        type="button"
        className="flex w-full items-center justify-between gap-2 text-left"
        onClick={() => setExpanded((v) => !v)}
      >
        <div className="flex items-center gap-2 text-sm font-medium">
          <Clock className="h-4 w-4 shrink-0" />
          Held sales
          <Badge variant="secondary" className="text-xs">{heldSales.length}</Badge>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={(e) => { e.stopPropagation(); fetchHeld() }}
            disabled={loading}
            aria-label="Refresh held sales"
          >
            <RefreshCw className={cn("h-3.5 w-3.5", loading && "animate-spin")} />
          </Button>
          <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform", expanded && "rotate-180")} />
        </div>
      </button>

      {expanded && (
        <ScrollArea className="mt-2 max-h-32 sm:max-h-36">
          <div className="space-y-2 pr-2">
            {heldSales.map((sale) => (
              <div
                key={sale._id}
                className="flex items-center justify-between gap-2 rounded-md border bg-background p-2 text-xs"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium">{sale.invoiceNo}</p>
                  <p className="truncate text-muted-foreground">
                    {sale.customerName} · {formatCurrency(sale.grandTotal)}
                  </p>
                </div>
                <div className="flex shrink-0 gap-1">
                  <Button size="sm" variant="outline" className="h-8 px-2" onClick={() => onResume(sale)}>
                    <Play className="mr-1 h-3 w-3" />
                    Resume
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0 text-destructive"
                    onClick={() => handleDelete(sale)}
                    aria-label="Delete held sale"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  )
}

export default HeldSalesPanel
