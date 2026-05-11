import React from 'react'

const TimeFilter = ({ timeFilter, setTimeFilter, isMobile = false, size = 'sm' }) => {
  const options = ['Today', 'Week', 'Month']
  
  const containerClasses = isMobile 
    ? "w-full flex items-center gap-0.5 rounded-full bg-white/80 backdrop-blur px-1 py-1 ring-1 ring-slate-200/50 shadow-sm"
    : "flex items-center gap-0.5 rounded-full bg-white/80 backdrop-blur px-1 py-1 ring-1 ring-slate-200/50 shadow-sm"
  
  const buttonClasses = isMobile
    ? "flex-1 px-3 py-2 text-sm font-medium rounded-full transition-all duration-200"
    : size === 'sm' 
      ? "px-3 py-1.5 text-xs font-medium rounded-full transition-all duration-200"
      : "px-4 py-2 text-sm font-medium rounded-full transition-all duration-200"

  return (
    <div className={containerClasses}>
      {options.map((label) => {
        const isActive = timeFilter === label.toLowerCase()
        return (
          <button
            key={label}
            onClick={() => setTimeFilter(label.toLowerCase())}
            className={`${buttonClasses} ${
              isActive
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-105'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/50'
            }`}
          >
            {label}
          </button>
        )
      })}
    </div>
  )
}

export default TimeFilter
