import React from 'react'

export default function StatCard({ title, value, icon: Icon, trend, trendValue, color = 'primary' }) {
  const colors = {
    primary: 'bg-[#E6FBF5] text-[#00D09C]',
    green: 'bg-[#E6FBF5] text-[#00D09C]',
    red: 'bg-[#FFE8E8] text-[#FF6B6B]',
    blue: 'bg-[#E8F4FD] text-[#3B82F6]',
    yellow: 'bg-[#FFF8E6] text-[#F59E0B]',
    purple: 'bg-[#F3E8FF] text-[#8B5CF6]',
    orange: 'bg-[#FFF0E6] text-[#F97316]'
  }
  
  return (
    <div className="bg-white rounded-2xl shadow-mobills p-3 sm:p-4 lg:p-5 hover:shadow-mobills-lg transition-all duration-200">
      <div className="flex flex-col items-center text-center md:flex-row md:items-start md:justify-between md:text-left gap-2 md:gap-3">
        {Icon && (
          <div className={`p-2 md:p-3 rounded-xl ${colors[color]} flex-shrink-0 mb-1 md:mb-0 md:order-2`}>
            <Icon size={18} className="md:w-6 md:h-6" />
          </div>
        )}
        <div className="flex-1 min-w-0 md:order-1">
          <p className="text-[11px] md:text-sm font-medium text-gray-500 mb-0.5 md:mb-1 truncate uppercase tracking-wide">{title}</p>
          <h3 className="text-base md:text-xl lg:text-2xl font-bold text-[#2D3436] mb-0.5 md:mb-2 truncate">{value}</h3>
          {trendValue && (
            <div className={`hidden md:flex items-center gap-1 text-xs sm:text-sm font-medium ${
              trend === 'up' ? 'text-[#00D09C]' : trend === 'down' ? 'text-[#FF6B6B]' : 'text-gray-500'
            }`}>
              {trend === 'up' ? '↑' : trend === 'down' ? '↓' : ''}
              <span className="truncate">{trendValue}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
