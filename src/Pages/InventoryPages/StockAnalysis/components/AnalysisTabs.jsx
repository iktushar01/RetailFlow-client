import React from 'react'

const AnalysisTabs = ({ tabs, activeTab, onTabChange }) => {
  return (
    <div className="bg-card rounded-lg shadow-sm border border-border">
      <div className="border-b border-border">
        <nav className="flex space-x-8 px-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`py-4 px-1 border-b-2 font-semibold text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted'
              }`}
            >
              {tab.label} 
              <span className={`ml-2 text-xs ${activeTab === tab.id ? 'text-primary' : 'text-muted-foreground/60'}`}>
                ({tab.count})
              </span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  )
}

export default AnalysisTabs
