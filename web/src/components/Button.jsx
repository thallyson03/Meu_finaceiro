import React from 'react'

export default function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  onClick, 
  type = 'button',
  disabled = false,
  fullWidth = false,
  className = ''
}) {
  const baseStyles = 'font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-2'
  
  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow-md disabled:bg-blue-300',
    secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-700 disabled:bg-gray-50',
    success: 'bg-green-600 hover:bg-green-700 text-white shadow-sm hover:shadow-md disabled:bg-green-300',
    danger: 'bg-red-600 hover:bg-red-700 text-white shadow-sm hover:shadow-md disabled:bg-red-300',
    outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50 disabled:border-blue-300 disabled:text-blue-300'
  }
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2.5 text-base',
    lg: 'px-6 py-3 text-lg'
  }
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
    >
      {children}
    </button>
  )
}


