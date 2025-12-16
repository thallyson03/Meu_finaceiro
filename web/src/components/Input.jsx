import React from 'react'

export default function Input({ 
  label, 
  type = 'text', 
  value, 
  onChange, 
  placeholder,
  required = false,
  error,
  icon: Icon,
  className = '',
  ...props 
}) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-semibold text-[#2D3436] mb-2">
          {label} {required && <span className="text-[#FF6B6B]">*</span>}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            <Icon size={20} />
          </div>
        )}
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={`w-full px-4 py-3 ${Icon ? 'pl-12' : ''} bg-[#F5F6FA] border-2 border-transparent rounded-xl focus:border-[#00D09C] focus:bg-white focus:shadow-[0_0_0_3px_rgba(0,208,156,0.1)] transition-all duration-200 text-[#2D3436] placeholder-gray-400 ${
            error ? 'border-[#FF6B6B] bg-[#FFE8E8]' : ''
          } ${className}`}
          {...props}
        />
      </div>
      {error && <p className="mt-2 text-sm text-[#FF6B6B] font-medium">{error}</p>}
    </div>
  )
}
