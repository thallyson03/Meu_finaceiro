import React from 'react'

export default function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  onClick, 
  type = 'button',
  disabled = false,
  fullWidth = false,
  className = '',
  style = {}
}) {
  const baseStyles = 'font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2'
  
  const variants = {
    primary: 'bg-[#00D09C] hover:bg-[#00B386] text-white shadow-mobills hover:shadow-mobills-lg disabled:bg-gray-300 disabled:cursor-not-allowed',
    secondary: 'bg-[#F5F6FA] hover:bg-gray-200 text-[#2D3436] disabled:bg-gray-100 disabled:cursor-not-allowed',
    success: 'bg-[#00D09C] hover:bg-[#00B386] text-white shadow-mobills hover:shadow-mobills-lg disabled:bg-gray-300',
    danger: 'bg-[#FF6B6B] hover:bg-[#FF5252] text-white shadow-mobills hover:shadow-mobills-lg disabled:bg-gray-300',
    outline: 'border-2 border-[#00D09C] text-[#00D09C] hover:bg-[#E6FBF5] disabled:border-gray-300 disabled:text-gray-300',
    ghost: 'text-[#00D09C] hover:bg-[#E6FBF5] disabled:text-gray-300'
  }
  
  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-5 py-2.5 text-base',
    lg: 'px-6 py-3 text-lg'
  }
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={style}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
    >
      {children}
    </button>
  )
}
