import React from 'react'

/**
 * Reusable Info/Alert Card Component
 * @param {string} type - Card type: 'info', 'warning', 'success', 'error'
 * @param {string} title - Card title
 * @param {string} message - Card message
 * @param {JSX.Element} icon - Icon component
 * @param {JSX.Element} children - Custom content
 */
const InfoCard = ({ type = 'info', title, message, icon: Icon, children }) => {
  const typeStyles = {
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      titleColor: 'text-blue-900',
      textColor: 'text-blue-700',
      iconColor: 'text-blue-600'
    },
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      titleColor: 'text-yellow-900',
      textColor: 'text-yellow-700',
      iconColor: 'text-yellow-600'
    },
    success: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      titleColor: 'text-green-900',
      textColor: 'text-green-700',
      iconColor: 'text-green-600'
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      titleColor: 'text-red-900',
      textColor: 'text-red-700',
      iconColor: 'text-red-600'
    }
  }

  const styles = typeStyles[type]

  return (
    <div className={`${styles.bg} p-4 rounded-lg border ${styles.border} flex items-start gap-3`}>
      {Icon && (
        <Icon className={`w-5 h-5 ${styles.iconColor} mt-0.5 flex-shrink-0`} />
      )}
      <div className="flex-1">
        {title && (
          <p className={`text-sm font-semibold ${styles.titleColor}`}>{title}</p>
        )}
        {message && (
          <p className={`text-sm ${styles.textColor} ${title ? 'mt-1' : ''}`}>
            {message}
          </p>
        )}
        {children}
      </div>
    </div>
  )
}

export default InfoCard

