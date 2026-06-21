import React, { useCallback, useEffect, useState } from 'react'
import { Clock, Play, Trash2, RefreshCw } from 'lucide-react'
import Swal from 'sweetalert2'
import { Button } from '@/Components/UI/button'
import { Badge } from '@/Components/UI/badge'
import { ScrollArea } from '@/Components/UI/scroll-area'
import { salesAPI } from '../services/posService'
import { formatCurrency } from '../utils/posHelpers'

const HeldSalesPanel = ({ onResume, onRefresh }) => {
  const [heldSales, setHeldSales] = useState([])
  const [loading, setLoading] = useState(false)

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
    const result = await Swal.fire({
      title: 'Delete held sale?',
      text: `Remove ${sale.invoiceNo}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete',
    })
    if (!result.isConfirmed) return

    try {
      await salesAPI.delete(sale._id)
      await fetchHeld()
      Swal.fire({ title: 'Deleted', icon: 'success', timer: 1200, showConfirmButton: false })
    } catch (error) {
      Swal.fire('Error', error.message || 'Failed to delete held sale', 'error')
    }
  }

  return (
    <div className="border rounded-lg bg-muted/20 p-3 space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <Clock className="w-4 h-4" />
          Held Sales
          <Badge variant="secondary">{heldSales.length}</Badge>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={fetchHeld} disabled={loading}>
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      <ScrollArea className="max-h-36">
        {heldSales.length === 0 ? (
          <p className="text-xs text-muted-foreground py-2">No held sales</p>
        ) : (
          <div className="space-y-2 pr-2">
            {heldSales.map((sale) => (
              <div
                key={sale._id}
                className="flex items-center justify-between gap-2 rounded-md border bg-background p-2 text-xs"
              >
                <div className="min-w-0">
                  <p className="font-medium truncate">{sale.invoiceNo}</p>
                  <p className="text-muted-foreground truncate">
                    {sale.customerName} · {formatCurrency(sale.grandTotal)}
                  </p>
                </div>
                <div className="flex gap-1 shrink-0">
                  <Button size="sm" variant="outline" className="h-7 px-2" onClick={() => onResume(sale)}>
                    <Play className="w-3 h-3 mr-1" />
                    Resume
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 w-7 p-0 text-destructive"
                    onClick={() => handleDelete(sale)}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  )
}

export default HeldSalesPanel
