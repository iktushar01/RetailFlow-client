import React from 'react'
import { 
  History, 
  ArrowRightLeft, 
  Package, 
  Clock, 
  MapPin, 
  CheckCircle,
  ArrowRight,
  Inbox
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/Components/UI/dialog"
import { ScrollArea } from "@/Components/UI/scroll-area"
import { Badge } from "@/Components/UI/badge"
import { Separator } from "@/Components/UI/separator"
import { Card } from "@/Components/UI/card"
import { formatTransferDate } from '../utils/stockTransferHelpers'

/**
 * Transfer History Modal Component refactored with Shadcn UI
 */
const TransferHistoryModal = ({ isOpen, onClose, transfers = [] }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent size="lg" className="gap-0 p-0">
        <DialogHeader className="shrink-0 p-4 sm:p-6 pb-2">
          <DialogTitle className="flex items-center gap-2 text-xl sm:text-2xl font-bold pr-8">
            <History className="w-6 h-6 text-primary" />
            Transfer History
          </DialogTitle>
          <DialogDescription>
            A detailed log of all stock movements across your warehouse locations.
          </DialogDescription>
        </DialogHeader>

        <Separator />

        <ScrollArea className="min-h-0 flex-1 p-4 sm:p-6">
          <div className="space-y-6">
            {transfers.length === 0 ? (
              <Card className="flex flex-col items-center justify-center py-12 border-dashed shadow-none bg-muted/30">
                <div className="bg-background rounded-full p-4 mb-4 shadow-sm border">
                  <Inbox className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">No records found</h3>
                <p className="text-sm text-muted-foreground text-center max-w-[250px]">
                  Stock transfers will appear here once you initiate your first movement.
                </p>
              </Card>
            ) : (
              transfers.map((transfer, index) => (
                <div key={transfer._id || index} className="relative">
                  <TransferCard transfer={transfer} />
                  {/* Subtle connector line for timeline effect */}
                  {index !== transfers.length - 1 && (
                    <div className="absolute left-[26px] -bottom-6 w-0.5 h-6 bg-border" />
                  )}
                </div>
              ))
            )}
          </div>
        </ScrollArea>
        
        <div className="shrink-0 p-4 border-t bg-muted/20 text-center">
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">
            Showing {transfers.length} movement records
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}

/**
 * Sub-component for individual transfer entries
 */
const TransferCard = ({ transfer }) => {
  const isCompleted = transfer.status === 'Completed' || !transfer.status

  return (
    <Card className="overflow-hidden border-border/60 hover:border-primary/40 transition-colors shadow-sm">
      <div className="p-5">
        {/* Upper section: Product Info & Meta */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <ArrowRightLeft className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h4 className="font-bold text-base leading-tight text-foreground">
                {transfer.productName}
              </h4>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] font-mono font-bold bg-muted px-1.5 py-0.5 rounded text-muted-foreground uppercase">
                  #{transfer.productId?.slice(-8) || 'N/A'}
                </span>
                <span className="text-muted-foreground">·</span>
                <span className="text-[11px] text-muted-foreground flex items-center">
                  <Clock className="w-3 h-3 mr-1" />
                  {formatTransferDate(transfer.createdAt)}
                </span>
              </div>
            </div>
          </div>
          <Badge 
            variant={isCompleted ? "success" : "outline"}
            className={isCompleted ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" : ""}
          >
            {transfer.status || 'Completed'}
          </Badge>
        </div>

        {/* Lower section: Logistics visualization */}
        <div className="flex items-center gap-2 bg-muted/30 rounded-lg p-3 border border-border/40">
          <div className="flex-1 text-center">
            <p className="text-[9px] font-black text-muted-foreground uppercase tracking-tighter mb-1">Source</p>
            <p className="text-xs font-bold truncate">{transfer.sourceWarehouse}</p>
          </div>
          
          <div className="flex flex-col items-center px-4 shrink-0">
            <div className="flex items-center justify-center gap-1 mb-1">
              <span className="h-px w-4 bg-border" />
              <div className="bg-primary/10 px-2 py-0.5 rounded text-[10px] font-black text-primary">
                {transfer.quantity}
              </div>
              <span className="h-px w-4 bg-border" />
            </div>
            <ArrowRight className="w-3 h-3 text-muted-foreground" />
          </div>

          <div className="flex-1 text-center">
            <p className="text-[9px] font-black text-muted-foreground uppercase tracking-tighter mb-1">Destination</p>
            <p className="text-xs font-bold truncate">{transfer.destinationWarehouse}</p>
          </div>
        </div>
      </div>
    </Card>
  )
}

export default TransferHistoryModal

