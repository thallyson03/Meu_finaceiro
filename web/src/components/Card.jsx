import React from 'react'

export default function Card({ children, className = '', hover = false, onClick }) {
  return (
    <div 
      onClick={onClick}
      className={`bg-white rounded-2xl shadow-mobills p-4 sm:p-5 lg:p-6 transition-all duration-200 ${
        hover ? 'hover:shadow-mobills-lg cursor-pointer' : ''
      } ${className}`}
    >
      {children}
    </div>
  )
}
