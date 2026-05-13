import React from 'react'
import { Package, Inbox, AlertCircle } from 'lucide-react'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/Components/UI/table"
import { Input } from "@/Components/UI/input"
import { Badge } from "@/Components/UI/badge"
import { getItemStatus } from '../utils/grnHelpers'
import { cn } from "@/lib/utils"

const GRNItemsTable = ({ 
  items = [], 
  readOnly = false,
  onItemChange
}) => {
  
  const totalOrdered = items.reduce((sum, item) => sum + (item.orderedQty || 0), 0)
  const totalReceived = items.reduce((sum, item) => sum + (item.receivedQty || 0), 0)
  const completionRate = totalOrdered > 0 ? Math.round((totalReceived / totalOrdered) * 100) : 0

  return (
    <div className="space-y-4">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-primary/10">
            <Package className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-bold leading-none">Product Items</h3>
            <p className="text-xs text-muted-foreground mt-1">
              Managing {items.length} line items
            </p>
          </div>
        </div>
      </div>

      {/* Shadcn Table */}
      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="w-[50px] font-bold">#</TableHead>
              <TableHead className="font-bold">Product Name</TableHead>
              <TableHead className="text-center font-bold">Ordered</TableHead>
              <TableHead className="text-center font-bold whitespace-nowrap">Prev. Recv</TableHead>
              <TableHead className="text-center font-bold">Remaining</TableHead>
              <TableHead className="text-center font-bold min-w-[120px]">Current Recv</TableHead>
              <TableHead className="font-bold">Batch #</TableHead>
              <TableHead className="font-bold">Expiry Date</TableHead>
              <TableHead className="text-center font-bold">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="h-48 text-center">
                  <div className="flex flex-col items-center justify-center text-muted-foreground">
                    <Inbox className="w-10 h-10 mb-2 opacity-20" />
                    <p className="font-medium text-sm">No items found</p>
                    <p className="text-xs">Select a Purchase Order to populate items</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              items.map((item, index) => {
                const itemStatus = getItemStatus(item)
                const remainingQty = item.remainingQty ?? item.orderedQty
                const alreadyReceived = item.alreadyReceived || 0

                return (
                  <TableRow key={item.id || index} className="group transition-colors">
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {(index + 1).toString().padStart(2, '0')}
                    </TableCell>
                    <TableCell className="font-medium">
                      <div className="flex flex-col">
                        <span>{item.productName || 'N/A'}</span>
                        <span className="text-[10px] text-muted-foreground uppercase">SKU: {item.productId?.slice(-6)}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline">{item.orderedQty || 0}</Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="secondary" className="bg-secondary/50">{alreadyReceived}</Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge 
                        className={cn(
                          "font-bold",
                          remainingQty === 0 ? "bg-green-500/10 text-green-600 border-green-200" : "bg-orange-500/10 text-orange-600 border-orange-200"
                        )}
                        variant="outline"
                      >
                        {remainingQty}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      {readOnly ? (
                        <span className="font-bold">{item.receivedQty || 0}</span>
                      ) : (
                        <Input
                          type="number"
                          min="0"
                          max={remainingQty}
                          value={item.receivedQty || 0}
                          onChange={(e) => {
                            const val = Math.min(parseInt(e.target.value) || 0, remainingQty)
                            onItemChange(item.id || index, 'receivedQty', val)
                          }}
                          disabled={remainingQty === 0}
                          className="w-20 mx-auto h-8 text-center font-bold"
                        />
                      )}
                    </TableCell>
                    <TableCell>
                      {readOnly ? (
                        <span className="text-sm">{item.batch || '-'}</span>
                      ) : (
                        <Input
                          placeholder="Batch"
                          value={item.batch || ''}
                          onChange={(e) => onItemChange(item.id || index, 'batch', e.target.value)}
                          className="h-8 text-xs min-w-[100px]"
                        />
                      )}
                    </TableCell>
                    <TableCell>
                      {readOnly ? (
                        <span className="text-sm">
                          {item.expiry ? new Date(item.expiry).toLocaleDateString() : '-'}
                        </span>
                      ) : (
                        <Input
                          type="date"
                          value={item.expiry || ''}
                          min={new Date().toISOString().split('T')[0]}
                          onChange={(e) => onItemChange(item.id || index, 'expiry', e.target.value)}
                          className="h-8 text-xs min-w-[130px]"
                        />
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge className={cn("text-[10px] px-2 py-0", itemStatus.color)}>
                        {itemStatus.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Footer / Summary Info */}
      {items.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-xl border bg-muted/30">
          <div className="flex gap-6 items-center">
             <div className="text-center">
                <p className="text-[10px] font-bold text-muted-foreground uppercase">Items</p>
                <p className="text-sm font-bold">{items.length}</p>
             </div>
             <div className="text-center">
                <p className="text-[10px] font-bold text-muted-foreground uppercase">Total Ordered</p>
                <p className="text-sm font-bold">{totalOrdered}</p>
             </div>
             <div className="text-center">
                <p className="text-[10px] font-bold text-muted-foreground uppercase">Current Receipt</p>
                <p className="text-sm font-bold text-primary">{totalReceived}</p>
             </div>
          </div>
          <div className="flex items-center justify-end gap-3">
             <span className="text-xs font-bold text-muted-foreground uppercase">Completion Status</span>
             <div className="flex items-center gap-2">
                <span className={cn(
                  "text-sm font-black",
                  completionRate === 100 ? "text-green-600" : "text-primary"
                )}>
                  {completionRate}%
                </span>
             </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default GRNItemsTable

