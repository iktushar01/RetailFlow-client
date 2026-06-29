import React from 'react'
import { cn } from '@/lib/utils'
import { Skeleton } from '@/Components/UI/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/Components/UI/table'
import { Card, CardContent } from '@/Components/UI/card'

/* ── Building blocks ─────────────────────────────────────────────── */

export function PageHeaderSkeleton({ showAction = true, className }) {
  return (
    <div className={cn(
      'flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b pb-6',
      className
    )}>
      <div className="space-y-2">
        <Skeleton className="h-8 w-52 md:w-64" />
        <Skeleton className="h-4 w-72 max-w-full" />
      </div>
      {showAction && <Skeleton className="h-9 w-28 shrink-0" />}
    </div>
  )
}

export function StatsGridSkeleton({ count = 4, className }) {
  return (
    <div className={cn(
      'grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4',
      className
    )}>
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i}>
          <CardContent className="flex items-center justify-between p-6">
            <div className="space-y-2">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-8 w-16" />
            </div>
            <Skeleton className="h-10 w-10 rounded-full" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export function FilterBarSkeleton({ className }) {
  return (
    <Card className={cn('p-4', className)}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Skeleton className="h-5 w-32" />
        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-9 w-36" />
          <Skeleton className="h-9 w-36" />
          <Skeleton className="h-9 w-24" />
        </div>
      </div>
    </Card>
  )
}

export function InfoCardSkeleton({ className }) {
  return (
    <Card className={cn('p-4', className)}>
      <div className="flex gap-3">
        <Skeleton className="h-5 w-5 shrink-0 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-4/5" />
        </div>
      </div>
    </Card>
  )
}

export function TabsSkeleton({ count = 3, className }) {
  return (
    <div className={cn('flex gap-2', className)}>
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className="h-9 w-28" />
      ))}
    </div>
  )
}

export function ChartSkeleton({ height = 'h-64', className }) {
  return (
    <Card className={cn('p-6', className)}>
      <Skeleton className="mb-4 h-5 w-36" />
      <Skeleton className={cn('w-full rounded-lg', height)} />
    </Card>
  )
}

export function TableSkeleton({
  rows = 6,
  columns = 5,
  showHeader = true,
  showActions = false,
  embedded = false,
  className,
}) {
  const colCount = columns + (showActions ? 1 : 0)

  return (
    <div className={cn(
      !embedded && 'rounded-lg border bg-card overflow-hidden shadow-none',
      className
    )}>
      <Table>
        {showHeader && (
          <TableHeader className="bg-muted/50">
            <TableRow>
              {Array.from({ length: colCount }).map((_, i) => (
                <TableHead key={i} className="h-11 px-4">
                  <Skeleton className="h-3.5 w-[65%]" />
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
        )}
        <TableBody>
          {Array.from({ length: rows }).map((_, rowIdx) => (
            <TableRow key={rowIdx}>
              {Array.from({ length: colCount }).map((_, colIdx) => (
                <TableCell key={colIdx} className="px-4 py-3">
                  <Skeleton className={cn('h-4', colIdx === 0 ? 'w-[75%]' : 'w-[50%]')} />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export function ListItemSkeleton({ count = 5, className }) {
  return (
    <div className={cn('space-y-3', className)}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 rounded-lg border p-4">
          <Skeleton className="h-10 w-10 shrink-0 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-3 w-2/3" />
          </div>
          <Skeleton className="h-6 w-16" />
        </div>
      ))}
    </div>
  )
}

export function CardGridSkeleton({ count = 8, className }) {
  return (
    <div className={cn(
      'grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
      className
    )}>
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className="h-64 rounded-2xl" />
      ))}
    </div>
  )
}

/* ── Page layouts ────────────────────────────────────────────────── */

export function ListPageSkeleton({
  stats = 0,
  showFilter = true,
  tableRows = 8,
  tableColumns = 5,
  showActions = true,
  className,
}) {
  return (
    <div className={cn('space-y-6 animate-in fade-in duration-300', className)}>
      <PageHeaderSkeleton />
      {stats > 0 && <StatsGridSkeleton count={stats} />}
      {showFilter && <FilterBarSkeleton />}
      <TableSkeleton
        rows={tableRows}
        columns={tableColumns}
        showActions={showActions}
      />
    </div>
  )
}

export function AnalyticsPageSkeleton({
  stats = 4,
  tabs = false,
  charts = 1,
  showFilter = true,
  showInfo = true,
  className,
}) {
  return (
    <div className={cn('space-y-6 animate-in fade-in duration-300', className)}>
      <PageHeaderSkeleton />
      <StatsGridSkeleton count={stats} />
      {showInfo && <InfoCardSkeleton />}
      {tabs && <TabsSkeleton />}
      {showFilter && <FilterBarSkeleton />}
      <TableSkeleton rows={6} columns={5} />
      {charts > 0 && (
        <div className={cn('grid gap-4', charts > 1 && 'md:grid-cols-2')}>
          {Array.from({ length: charts }).map((_, i) => (
            <ChartSkeleton key={i} />
          ))}
        </div>
      )}
    </div>
  )
}

export function DashboardPageSkeleton({ className }) {
  return (
    <div className={cn('mx-auto space-y-8 p-4 md:p-8 pt-6 animate-in fade-in duration-300', className)}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-9 w-28" />
          <Skeleton className="h-9 w-24" />
          <Skeleton className="h-9 w-24" />
        </div>
      </div>

      <StatsGridSkeleton count={4} />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <ChartSkeleton height="h-72" className="xl:col-span-2" />
        <ChartSkeleton height="h-72" />
      </div>

      <Card className="p-6">
        <Skeleton className="mb-4 h-5 w-36" />
        <TableSkeleton rows={4} columns={4} embedded />
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="p-6 lg:col-span-2">
          <Skeleton className="mb-4 h-5 w-28" />
          <ListItemSkeleton count={3} />
        </Card>
        <Card className="p-6">
          <Skeleton className="mb-4 h-5 w-32" />
          <div className="space-y-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}

export function PosPageSkeleton({ className }) {
  return (
    <div className={cn('space-y-4 p-4 animate-in fade-in duration-300', className)}>
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-9 w-24" />
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="p-4 lg:col-span-2">
          <Skeleton className="mb-4 h-9 w-full" />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-24 w-full rounded-lg" />
            ))}
          </div>
        </Card>
        <Card className="p-4">
          <Skeleton className="mb-4 h-5 w-24" />
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
          <Skeleton className="mt-6 h-10 w-full" />
        </Card>
      </div>
    </div>
  )
}

export function NotificationsPageSkeleton({ className }) {
  return (
    <div className={cn('space-y-6 p-4 md:p-6 animate-in fade-in duration-300', className)}>
      <PageHeaderSkeleton />
      <div className="flex gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-9 w-20" />
        ))}
      </div>
      <ListItemSkeleton count={6} />
    </div>
  )
}

export function AuthPageSkeleton({ className }) {
  return (
    <div className={cn('flex min-h-screen items-center justify-center bg-background', className)}>
      <div className="w-full max-w-sm space-y-6 p-8">
        <div className="flex flex-col items-center space-y-3">
          <Skeleton className="h-12 w-12 rounded-lg" />
          <Skeleton className="h-6 w-32" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 text-center">
          <p className="text-sm font-semibold text-foreground">
            First load may take up to 45 seconds
          </p>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
            The server is waking up. On the free Render plan this can take up to 45 seconds on the first visit after idle time. Please wait and do not refresh.
          </p>
        </div>
      </div>
    </div>
  )
}
