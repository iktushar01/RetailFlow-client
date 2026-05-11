import React from 'react'
import Button from '../../Components/UI/Button'
import { Filter, Download, RefreshCw } from 'lucide-react'

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
  return (
    <div className="bg-white rounded-sm shadow-sm border border-gray-100 p-4 sm:p-5 mt-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-4">
        <div className="flex items-center gap-3">
          <Filter className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          {showClear && (
            <Button
              variant="secondary"
              size="sm"
              onClick={onClearFilters}
              className="w-full sm:w-auto"
            >
              <div className="flex p-1 items-center justify-center sm:justify-start">
                <RefreshCw className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Clear Filters</span>
                <span className="sm:hidden">Clear</span>
              </div>
            </Button>
          )}
          {showExport && (
            <Button
              variant="secondary"
              size="sm"
              onClick={onExport}
              className="w-full sm:w-auto"
            >
              <div className="flex p-1 items-center justify-center sm:justify-start">
                <Download className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Export</span>
                <span className="sm:hidden">Export</span>
              </div>
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4">
        {filterConfig.map((config, index) => (
          <div key={index} className={config.span ? `lg:col-span-${config.span}` : ''}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {config.label}
            </label>
            {config.type === 'search' ? (
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={filters[config.key] || ''}
                  onChange={(e) => onFilterChange(config.key, e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 sm:py-3 rounded-xl border border-gray-200 bg-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 shadow-sm hover:shadow-md"
                  placeholder={config.placeholder}
                />
              </div>
            ) : config.type === 'select' ? (
              <select
                value={filters[config.key] || ''}
                onChange={(e) => onFilterChange(config.key, e.target.value)}
                className="w-full px-3 py-2.5 sm:py-3 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                {config.options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            ) : config.type === 'date' ? (
              <input
                type="date"
                value={filters[config.key] || ''}
                onChange={(e) => onFilterChange(config.key, e.target.value)}
                className="w-full px-3 py-2.5 sm:py-3 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 shadow-sm hover:shadow-md"
                placeholder={config.placeholder}
              />
            ) : null}
          </div>
        ))}
      </div>

      {/* Filter Results Summary */}
      <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between text-sm text-gray-600 gap-3">
        <div>
          Showing <span className="font-medium text-gray-900">{resultsCount}</span> of <span className="font-medium text-gray-900">{totalCount}</span> items
        </div>
        {Object.values(filters).some(filter => filter !== '') && (
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <span className="text-blue-600 font-medium">Filters applied</span>
            <div className="flex flex-wrap items-center gap-1">
              {Object.entries(filters).map(([key, value]) => {
                if (!value) return null;
                const config = filterConfig.find(c => c.key === key);
                if (!config) return null;
                
                return (
                  <span 
                    key={key}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800 whitespace-nowrap"
                  >
                    {config.label}: {value}
                  </span>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
