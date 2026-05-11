import React from 'react'
import Button from '../../Components/UI/Button'

/**
 * Reusable Empty State Component
 * @param {JSX.Element} icon - Icon component
 * @param {string} title - Empty state title
 * @param {string} message - Empty state message
 * @param {Object} action - Action button config {label, onClick, icon}
 */
const EmptyState = ({ icon: Icon, title, message, action }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      {Icon && (
        <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
          <Icon className="w-10 h-10 text-gray-400" />
        </div>
      )}
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      {message && (
        <p className="text-sm text-gray-600 max-w-md mb-6">{message}</p>
      )}
      {action && (
        <Button
          variant={action.variant || 'primary'}
          size={action.size || 'md'}
          onClick={action.onClick}
        >
          <div className="flex items-center">
            {action.icon && <action.icon className="w-5 h-5 mr-2" />}
            {action.label}
          </div>
        </Button>
      )}
    </div>
  )
}

export default EmptyState

