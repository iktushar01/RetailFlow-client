import React from 'react'

const MetricsCard = ({ 
  label, 
  value, 
  subtitle, 
  icon: Icon, // eslint-disable-line no-unused-vars
  color = 'blue', 
  onClick,
  className = '' 
}) => {
  const colorClasses = {
    blue: 'from-indigo-50 to-indigo-100 text-indigo-700',
    green: 'from-green-50 to-green-100 text-green-700',
    emerald: 'from-emerald-50 to-emerald-100 text-emerald-700',
    red: 'from-red-50 to-red-100 text-red-700',
    amber: 'from-amber-50 to-amber-100 text-amber-700'
  }

  const textColorClasses = {
    blue: 'text-slate-500',
    green: 'text-slate-500',
    emerald: 'text-emerald-600',
    red: 'text-red-600',
    amber: 'text-amber-600'
  }

  const CardComponent = onClick ? 'div' : 'div'
  const cardProps = onClick ? { onClick, className: 'cursor-pointer' } : {}

  return (
    <CardComponent
      {...cardProps}
      className={`group rounded-2xl bg-white/70 backdrop-blur ring-1 ring-slate-200/70 p-5 shadow-sm hover:shadow-xl transition-all ${className}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
          <p className="text-3xl font-bold mt-1">{value}</p>
          <p className={`text-xs mt-1 ${textColorClasses[color]}`}>{subtitle}</p>
        </div>
        <div className={`p-3 rounded-xl bg-gradient-to-br ${colorClasses[color]}`}>
          <Icon />
        </div>
      </div>
    </CardComponent>
  )
}

export default MetricsCard
