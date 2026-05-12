import React from 'react'
import { Pencil, Trash2, ToggleLeft, ToggleRight } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { getStatusColor, getStatusLabel } from '../utils/discountsHelpers'

const DiscountsList = ({ discounts, onEdit, onDelete, onToggleStatus, loading }) => {
  
  if (loading) {
    return <div className="flex justify-center p-8 text-muted-foreground">Loading discounts...</div>
  }

  return (
    <div className="rounded-xl border border-border bg-card text-card-foreground shadow-sm overflow-hidden">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow>
            <TableHead className="font-bold">Offer Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Discount</TableHead>
            <TableHead>Valid From</TableHead>
            <TableHead>Valid To</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {discounts.length > 0 ? (
            discounts.map((discount) => (
              <TableRow key={discount.id || discount._id}>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-semibold text-foreground">{discount.offerName}</span>
                    {discount.code && (
                      <span className="text-xs text-muted-foreground font-mono">
                        Code: {discount.code}
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className="font-medium">
                    {discount.type}
                  </Badge>
                </TableCell>
                <TableCell>
                  <span className="font-bold text-primary">
                    {discount.type === 'Percentage' ? `${discount.value}%` : `$${discount.value}`}
                  </span>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {new Date(discount.validFrom).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {new Date(discount.validTo).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {/* getStatusColor should return Shadcn-friendly tailwind classes like 'bg-destructive/10 text-destructive' */}
                  <Badge 
                    variant="outline" 
                    className={`${getStatusColor(discount)} border-transparent`}
                  >
                    {getStatusLabel(discount)}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className={discount.status === 'Active' ? "text-destructive hover:text-destructive" : "text-primary"}
                      onClick={() => onToggleStatus(discount)}
                    >
                      {discount.status === 'Active' ? (
                        <ToggleRight className="w-4 h-4 mr-1" />
                      ) : (
                        <ToggleLeft className="w-4 h-4 mr-1" />
                      )}
                      {discount.status === 'Active' ? 'Deactivate' : 'Activate'}
                    </Button>

                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => onEdit(discount)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>

                    <Button
                      variant="destructive"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => onDelete(discount)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                No discounts found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}

export default DiscountsList