import React from 'react'

export default function Card({ children, className = '', hover = false, onClick }) {
  return (
    <div 
      onClick={onClick}
      className={`bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-5 lg:p-6 transition-all duration-200 ${
        hover ? 'hover:shadow-md hover:border-blue-100 cursor-pointer' : ''
      } ${className}`}
    >
      {children}
    </div>
  )
}

