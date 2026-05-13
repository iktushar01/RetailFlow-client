import React from 'react'
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../Components/UI/Table"
import { Button } from "../../Components/UI/button"
import { 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight,
  ArrowUpDown,
  Inbox
} from "lucide-react"
import { cn } from "@/lib/utils"

export const SharedTable = ({
  columns = [],
  data = [],
  pageSize = 10,
  loading = false,
  renderRowActions,
  actionsHeader = 'Actions',
}) => {
  const [sorting, setSorting] = React.useState([])
  const [globalFilter, setGlobalFilter] = React.useState('')

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      globalFilter,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize,
      },
    },
  })

  return (
    <div className="space-y-4">
      {/* Table Container */}
      <div className="rounded-md border border-border bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="h-12 px-4 text-xs font-bold uppercase tracking-wider">
                    {header.isPlaceholder ? null : (
                      <button
                        className={cn(
                          "flex items-center gap-2 hover:text-foreground transition-colors",
                          header.column.getCanSort() ? "cursor-pointer select-none" : "cursor-default"
                        )}
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {header.column.getCanSort() && (
                          <ArrowUpDown className={cn(
                            "ml-2 h-4 w-4",
                            header.column.getIsSorted() ? "text-primary" : "text-muted-foreground/50"
                          )} />
                        )}
                      </button>
                    )}
                  </TableHead>
                ))}
                {renderRowActions && (
                  <TableHead className="text-xs font-bold uppercase tracking-wider">
                    {actionsHeader}
                  </TableHead>
                )}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={columns.length + (renderRowActions ? 1 : 0)} className="h-48 text-center">
                  <div className="flex flex-col items-center justify-center space-y-4">
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                    <p className="text-sm font-medium text-muted-foreground">Loading data...</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} className="group hover:bg-muted/30 transition-colors">
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="px-4 py-3 sm:py-4">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                  {renderRowActions && (
                    <TableCell className="px-4 py-3 sm:py-4">
                      <div className="flex items-center justify-start">
                        {renderRowActions(row.original)}
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length + (renderRowActions ? 1 : 0)} className="h-48 text-center">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <div className="rounded-full bg-muted p-4">
                      <Inbox className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <p className="text-sm font-medium text-muted-foreground">No data available</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      {!loading && table.getPageCount() > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between px-2 py-4 gap-4 bg-card border border-border rounded-lg shadow-sm">
          <div className="flex-1 text-sm text-muted-foreground">
            Showing <span className="font-semibold text-foreground">{table.getState().pagination.pageIndex * pageSize + 1}</span> to{' '}
            <span className="font-semibold text-foreground">
              {Math.min((table.getState().pagination.pageIndex + 1) * pageSize, table.getFilteredRowModel().rows.length)}
            </span> of{' '}
            <span className="font-semibold text-foreground">{table.getFilteredRowModel().rows.length}</span> records
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              className="hidden lg:flex h-8 w-8"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 gap-1"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Previous</span>
            </Button>
            <Button
              variant="default"
              size="sm"
              className="h-8 gap-1"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <span>Next</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="hidden lg:flex h-8 w-8"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
