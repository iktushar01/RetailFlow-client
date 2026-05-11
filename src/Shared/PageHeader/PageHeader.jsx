import React from 'react'
import Button from '../../Components/UI/Button'

/**
 * Reusable Page Header Component
 * @param {string} title - Page title
 * @param {string} subtitle - Page subtitle/description
 * @param {JSX.Element} icon - Icon component
 * @param {Array} actions - Array of action button configs
 * @param {JSX.Element} children - Additional custom content
 */
const PageHeader = ({ title, subtitle, icon: Icon, actions = [], children }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            {Icon && (
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <Icon className="w-6 h-6 text-white" />
              </div>
            )}
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
              {subtitle && <p className="text-gray-600 mt-1">{subtitle}</p>}
            </div>
          </div>
          {children}
        </div>

        {actions.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {actions.map((action, index) => (
              <Button
                key={index}
                variant={action.variant || 'primary'}
                size={action.size || 'md'}
                onClick={action.onClick}
                disabled={action.disabled}
              >
                <div className="flex items-center">
                  {action.icon && <action.icon className="w-5 h-5 mr-2" />}
                  {action.label}
                </div>
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default PageHeader

