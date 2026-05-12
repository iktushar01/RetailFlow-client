import React from 'react'

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  disabled = false,
  loading = false,
  ...props 
}) => {
  const baseClasses = `
    inline-flex items-center justify-center font-medium rounded-md
    transition-all duration-300 ease-out
    transform hover:scale-105 active:scale-95
    focus:outline-none focus:ring-1 focus:ring-opacity-50
    relative overflow-hidden
    disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
    group
  `
  
  const variants = {
    primary: `
      bg-gradient-to-r from-blue-500 to-purple-600 
      text-white shadow-lg hover:shadow-xl
      hover:from-blue-600 hover:to-purple-700
      focus:ring-blue-500/50
      before:absolute before:inset-0 before:bg-gradient-to-r before:from-white before:to-transparent before:opacity-0 
      hover:before:opacity-10 before:transition-opacity before:duration-300
    `,
    secondary: `
      bg-gradient-to-r from-gray-100 to-gray-200
      text-gray-900 shadow-md hover:shadow-lg
      hover:from-gray-200 hover:to-gray-300
      focus:ring-gray-500/50
      border border-gray-200/50
    `,
    outline: `
      border-2 border-blue-500 
      text-blue-600 hover:bg-blue-500 hover:text-white
      focus:ring-blue-500/50
      transition-colors duration-200
    `,
    ghost: `
      text-gray-700 hover:bg-gray-100 
      focus:ring-gray-500/50
      hover:shadow-md
    `,
    glass: `
      bg-white/10 backdrop-blur-md 
      text-white border border-white/20
      hover:bg-white/20 hover:border-white/30
      focus:ring-white/50
      shadow-lg hover:shadow-xl
    `,
    neon: `
      bg-black text-cyan-400 
      border border-cyan-400
      shadow-lg shadow-cyan-500/25
      hover:shadow-cyan-400/40 hover:bg-cyan-400 hover:text-black
      focus:ring-cyan-400/50
      font-semibold
    `,
    destructive: `
      bg-gradient-to-r from-red-500 to-pink-600 
      text-white shadow-lg hover:shadow-xl
      hover:from-red-600 hover:to-pink-700
      focus:ring-red-500/50
      before:absolute before:inset-0 before:bg-gradient-to-r before:from-white before:to-transparent before:opacity-0 
      hover:before:opacity-10 before:transition-opacity before:duration-300
    `,
    edit: `
      bg-gradient-to-r from-emerald-500 to-green-500 
      text-white shadow-lg hover:shadow-xl
      hover:from-emerald-600 hover:to-green-700
      focus:ring-emerald-500/50
      before:absolute before:inset-0 before:bg-gradient-to-r before:from-white before:to-transparent before:opacity-0 
      hover:before:opacity-10 before:transition-opacity before:duration-300
    `,
    delete: `
      bg-gradient-to-r from-rose-500 to-red-600 
      text-white shadow-lg hover:shadow-xl
      hover:from-rose-600 hover:to-red-700
      focus:ring-rose-500/50
      before:absolute before:inset-0 before:bg-gradient-to-r before:from-white before:to-transparent before:opacity-0 
      hover:before:opacity-10 before:transition-opacity before:duration-300
      animate-pulse-on-hover
    `
  }
  
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  }

  const loadingSpinner = (
    <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
  )

  const classes = `
    ${baseClasses} 
    ${variants[variant]} 
    ${sizes[size]} 
    ${disabled ? 'pointer-events-none' : ''}
    ${className}
  `.replace(/\s+/g, ' ').trim()

  return (
    <button 
      className={classes} 
      disabled={disabled || loading}
      {...props}
    >
      {/* Ripple Effect Container */}
      <span className="absolute inset-0 overflow-hidden rounded-xl">
        <span className="absolute inset-0 -translate-x-full group-hover:translate-x-0 transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      </span>

      {/* Loading State */}
      {loading && (
        <span className="absolute inset-0 flex items-center justify-center bg-inherit rounded-xl">
          {loadingSpinner}
        </span>
      )}

      {/* Content */}
      <span className={`relative transition-all duration-200 ${loading ? 'opacity-0' : 'opacity-100'}`}>
        {children}
      </span>

      {/* Pulse Animation for Special States */}
      {(variant === 'neon' || variant === 'primary' || variant === 'edit' || variant === 'delete') && !disabled && (
        <span className="absolute inset-0 rounded-xl group-hover:animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="absolute inset-0 rounded-xl bg-current opacity-10" />
        </span>
      )}

      {/* Special delete button warning effect */}
      {variant === 'delete' && !disabled && (
        <span className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-rose-300/50 transition-all duration-300" />
      )}
    </button>
  )
}

export default Button