import React from 'react'
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/Components/UI/dialog"
import { Button } from "@/Components/UI/button"
import { Badge } from "@/Components/UI/badge"
import { Separator } from "@/Components/UI/separator"
import { ScrollArea } from "@/Components/UI/scroll-area"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/Components/UI/table"
import { FileText, Truck, Calendar, User, PackageCheck } from 'lucide-react'
import { formatDate, getTotalReceivedQty } from '../utils/stockInHelpers'

export const StockInDetailsDialog = ({ isOpen, onOpenChange, grn, suppliers }) => {
  if (!grn) return null

  const supplier = suppliers.find(s => s._id === grn.supplierId)

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <FileText className="w-5 h-5 text-emerald-600" />
            GRN Details: {grn.grnNumber}
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-6 py-4">
            {/* Top Info Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <InfoBlock label="PO Number" value={grn.poNumber} icon={PackageCheck} />
              <InfoBlock label="Received Date" value={formatDate(grn.receivedDate).split(',')[0]} icon={Calendar} />
              <InfoBlock label="Total Qty" value={getTotalReceivedQty(grn)} icon={Truck} />
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold text-muted-foreground uppercase">Status</span>
                <Badge className="w-fit bg-emerald-500 hover:bg-emerald-600">Approved</Badge>
              </div>
            </div>

            <Separator />

            {/* Supplier Info */}
            <div className="bg-muted/30 p-4 rounded-lg flex items-start gap-3">
              <div className="bg-background p-2 rounded-full border">
                <User className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase">Supplier Information</p>
                <p className="font-semibold text-foreground">{supplier?.supplierName || 'Unknown Supplier'}</p>
                <p className="text-sm text-muted-foreground">{supplier?.email || 'No email provided'}</p>
              </div>
            </div>

            {/* Items Table */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold flex items-center gap-2">
                <Truck className="w-4 h-4" /> Received Items List
              </h4>
              <div className="rounded-md border">
                <Table>
                  <TableHeader className="bg-muted/50">
                    <TableRow>
                      <TableHead>Product Name</TableHead>
                      <TableHead>Batch</TableHead>
                      <TableHead className="text-center">Ordered</TableHead>
                      <TableHead className="text-center">Received</TableHead>
                      <TableHead className="text-right">Expiry</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {grn.items?.map((item, idx) => (
                      <TableRow key={idx}>
                        <TableCell className="font-medium">{item.productName}</TableCell>
                        <TableCell className="font-mono text-xs">{item.batch || 'N/A'}</TableCell>
                        <TableCell className="text-center">{item.orderQty || 0}</TableCell>
                        <TableCell className="text-center font-bold text-emerald-600">
                          {item.receivedQty || 0}
                        </TableCell>
                        <TableCell className="text-right text-xs text-muted-foreground">
                          {item.expiryDate ? formatDate(item.expiryDate).split(',')[0] : 'N/A'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* Notes Section if exists */}
            {grn.notes && (
              <div className="bg-amber-50/50 border border-amber-100 p-3 rounded-md text-sm">
                <p className="font-bold text-amber-800 text-xs uppercase mb-1">Notes / Remarks</p>
                <p className="text-amber-700">{grn.notes}</p>
              </div>
            )}
          </div>
        </ScrollArea>

        <DialogFooter className="border-t pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close Details
          </Button>
          <Button className="bg-emerald-600 hover:bg-emerald-700">
            Print GRN
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

const InfoBlock = ({ label, value, icon: Icon }) => (
  <div className="flex flex-col gap-1">
    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-tight">{label}</span>
    <div className="flex items-center gap-1.5">
      <Icon className="w-3.5 h-3.5 text-muted-foreground" />
      <span className="text-sm font-semibold">{value || 'N/A'}</span>
    </div>
  </div>
)

