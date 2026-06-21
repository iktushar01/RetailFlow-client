import React from 'react'
import { Download, RefreshCw, Search } from 'lucide-react'
import { Button } from '../../Components/UI/button'
import { Input } from '../../Components/UI/input'
import { Label } from '../../Components/UI/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../Components/UI/select"
import { cn } from "@/lib/utils"

export const ReusableFilter = ({
  filters = {},
  onFilterChange = () => { },
  onClearFilters = () => { },
  onExport = () => { },
  filterConfig = [],
  title,
  showExport = false,
  showClear = true,
  showTitle = false,
  showResults = false,
  resultsCount = 0,
  totalCount = 0,
  className,
}) => {
  return (
    <div className={cn("rounded-lg border bg-card p-4 shadow-none", className)}>
      {showTitle && title && (
        <h3 className="mb-4 text-sm font-medium text-foreground">{title}</h3>
      )}

      <div className="flex flex-wrap items-end gap-4">
        {filterConfig.map((config, index) => (
          <div
            key={config.key || index}
            className={cn(
              "min-w-[180px] flex-1 space-y-1.5",
              config.type === 'search' && "min-w-[240px]",
              config.span === 2 && "min-w-[280px] lg:min-w-[360px]"
            )}
          >
            <Label className="text-xs text-muted-foreground">{config.label}</Label>

            {config.type === 'search' ? (
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  value={filters[config.key] || ''}
                  onChange={(e) => onFilterChange(config.key, e.target.value)}
                  placeholder={config.placeholder}
                  className="pl-8"
                />
              </div>
            ) : config.type === 'select' ? (
              <Select
                value={filters[config.key] ? String(filters[config.key]) : '__all__'}
                onValueChange={(val) => onFilterChange(config.key, val === '__all__' ? '' : val)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={config.placeholder || "Select..."} />
                </SelectTrigger>
                <SelectContent>
                  {config.options.map((opt) => {
                    const selectValue = opt.value === '' ? '__all__' : String(opt.value)
                    return (
                      <SelectItem key={selectValue} value={selectValue}>
                        {opt.label}
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
            ) : config.type === 'date' ? (
              <Input
                type="date"
                value={filters[config.key] || ''}
                onChange={(e) => onFilterChange(config.key, e.target.value)}
                className="w-full"
              />
            ) : null}
          </div>
        ))}

        <div className="flex shrink-0 items-center gap-2 pb-0.5">
          {showClear && (
            <Button variant="ghost" size="sm" onClick={onClearFilters}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Reset
            </Button>
          )}
          {showExport && (
            <Button variant="outline" size="sm" onClick={onExport}>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          )}
        </div>
      </div>

      {showResults && (
        <p className="mt-3 text-sm text-muted-foreground">
          Showing <span className="font-medium text-foreground">{resultsCount}</span>
          {totalCount > 0 && (
            <> of <span className="font-medium text-foreground">{totalCount}</span></>
          )} items
        </p>
      )}
    </div>
  )
}
