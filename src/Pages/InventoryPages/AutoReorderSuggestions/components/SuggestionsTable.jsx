import React from 'react'
import { Package, Plus, AlertCircle, Clock, CheckCircle2 } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

const SuggestionsTable = ({ 
  suggestions = [], 
  suppliers = [], 
  loading, 
  onAddToPO 
}) => {
  
  const getPriorityConfig = (priority) => {
    switch (priority) {
      case 'High':
        return { 
          variant: "destructive", 
          icon: <AlertCircle className="w-3 h-3 mr-1" />,
          className: "bg-destructive/15 text-destructive border-destructive/20 hover:bg-destructive/20"
        }
      case 'Medium':
        return { 
          variant: "outline", 
          icon: <Clock className="w-3 h-3 mr-1" />,
          className: "bg-amber-500/15 text-amber-600 border-amber-500/20 hover:bg-amber-500/20 dark:text-amber-400"
        }
      case 'Low':
        return { 
          variant: "secondary", 
          icon: <CheckCircle2 className="w-3 h-3 mr-1" />,
          className: "bg-emerald-500/15 text-emerald-600 border-emerald-500/20 hover:bg-emerald-500/20 dark:text-emerald-400"
        }
      default:
        return { variant: "secondary", icon: null, className: "" }
    }
  }

  return (
    <Card className="border-border bg-card shadow-sm">
      <CardHeader className="border-b border-border/50 bg-muted/20 pb-4">
        <CardTitle className="text-lg font-semibold text-foreground flex items-center">
          <Package className="w-5 h-5 mr-2 text-primary" />
          Reorder Suggestions
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow>
              <TableHead className="w-[300px]">Product</TableHead>
              <TableHead className="text-center">Avg Monthly Sale</TableHead>
              <TableHead className="text-center">Current Stock</TableHead>
              <TableHead className="text-center">Suggested Qty</TableHead>
              <TableHead className="text-center">Supplier</TableHead>
              <TableHead className="text-center">Priority</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 7 }).map((_, j) => (
                    <TableCell key={j}><Skeleton className="h-6 w-full" /></TableCell>
                  ))}
                </TableRow>
              ))
            ) : suggestions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                  No reorder suggestions available
                </TableCell>
              </TableRow>
            ) : (
              suggestions.map((item) => {
                const supplier = suppliers.find(s => s._id === item.supplierId);
                const priorityStyle = getPriorityConfig(item.priority);
                
                return (
                  <TableRow key={item._id || item.sku} className="hover:bg-muted/50 transition-colors">
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium text-foreground">{item.productName}</div>
                        <div className="text-xs text-muted-foreground font-mono">SKU: {item.sku}</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="text-base font-semibold">{item.monthlySales}</div>
                      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">units/mo</div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="text-base font-semibold">{item.currentStock}</div>
                      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">units</div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="text-base font-bold text-primary">{item.suggestedQty}</div>
                      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">units</div>
                    </TableCell>
                    <TableCell className="text-center font-medium text-sm">
                      {supplier?.name || 'Unknown'}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge 
                        variant={priorityStyle.variant} 
                        className={`capitalize px-2 py-0.5 rounded-full border ${priorityStyle.className}`}
                      >
                        {priorityStyle.icon}
                        {item.priority}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => onAddToPO(item)}
                        className="h-8"
                      >
                        <Plus className="w-3.5 h-3.5 mr-1.5" />
                        Add to PO
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

export default SuggestionsTable