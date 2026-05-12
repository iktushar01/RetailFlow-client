import React from 'react'
import { Filter, Download, RefreshCw, Search } from 'lucide-react'
import { Button } from '../../Components/UI/Button'
import { Input } from '../../Components/UI/Input'
import { Label } from '../../Components/UI/Label'
import { Badge } from '../../Components/UI/Badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../Components/UI/Select"
import { cn } from "@/lib/utils"

export const ReusableFilter = ({
  filters = {},
  onFilterChange = () => {},
  onClearFilters = () => {},
  onExport = () => {},
  filterConfig = [],
  title = "Filters & Search",
  showExport = true,
  showClear = true,
  resultsCount = 0,
  totalCount = 0
}) => {
  const hasActiveFilters = Object.values(filters).some(f => f !== '' && f !== null && f !== undefined);

  return (
    <div className="bg-card text-card-foreground rounded-lg border border-border p-4 sm:p-6 mt-4 shadow-sm transition-colors">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <div className="flex items-center gap-3">
          <Filter className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {showClear && (
            <Button
              variant="outline"
              size="sm"
              onClick={onClearFilters}
              className="h-9 gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span className="hidden sm:inline">Clear Filters</span>
              <span className="sm:hidden">Clear</span>
            </Button>
          )}
          {showExport && (
            <Button
              variant="secondary"
              size="sm"
              onClick={onExport}
              className="h-9 gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </Button>
          )}
        </div>
      </div>

      {/* Filters Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {filterConfig.map((config, index) => (
          <div key={config.key || index} className={cn("space-y-2", config.span && `lg:col-span-${config.span}`)}>
            <Label className="text-sm font-medium text-muted-foreground">
              {config.label}
            </Label>
            
            {config.type === 'search' ? (
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  value={filters[config.key] || ''}
                  onChange={(e) => onFilterChange(config.key, e.target.value)}
                  placeholder={config.placeholder}
                  className="pl-9"
                />
              </div>
            ) : config.type === 'select' ? (
              <Select 
                value={filters[config.key] || ""} 
                onValueChange={(val) => onFilterChange(config.key, val)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={config.placeholder || "Select..."} />
                </SelectTrigger>
                <SelectContent>
                  {config.options.map((opt) => (
                    opt.value && opt.value !== '' ? (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ) : null
                  ))}
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
      </div>

      {/* Results Summary & Active Badges */}
      <div className="mt-6 pt-4 border-t border-border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-sm">
        <div className="text-muted-foreground">
          Showing <span className="font-semibold text-foreground">{resultsCount}</span> of <span className="font-semibold text-foreground">{totalCount}</span> items
        </div>

        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">Active:</span>
            {Object.entries(filters).map(([key, value]) => {
              if (!value) return null;
              const config = filterConfig.find(c => c.key === key);
              if (!config) return null;
              
              return (
                <Badge 
                  key={key} 
                  variant="secondary" 
                  className="rounded-md font-normal px-2 py-0.5"
                >
                  <span className="opacity-70 mr-1">{config.label}:</span>
                  {value}
                </Badge>
              );
            })}
          </div>
        )}
      </div>
    </div>
  )
}