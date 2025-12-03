import React from 'react'

export default function StatCard({ title, value, icon: Icon, trend, trendValue, color = 'blue' }) {
  const colors = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    red: 'bg-red-100 text-red-600',
    yellow: 'bg-yellow-100 text-yellow-600',
    purple: 'bg-purple-100 text-purple-600',
    orange: 'bg-orange-100 text-orange-600'
  }
  
  return (
    <div className="bg-white rounded-lg md:rounded-xl shadow-sm border border-gray-100 p-2 sm:p-4 lg:p-6 hover:shadow-md transition-all duration-200">
      {/* Mobile: layout vertical centralizado / Desktop: layout horizontal */}
      <div className="flex flex-col items-center text-center md:flex-row md:items-start md:justify-between md:text-left gap-1 md:gap-3">
        {/* Ícone no topo em mobile */}
        {Icon && (
          <div className={`p-1.5 md:p-3 rounded-lg ${colors[color]} flex-shrink-0 mb-1 md:mb-0 md:order-2`}>
            <Icon size={16} className="md:w-6 md:h-6" />
          </div>
        )}
        <div className="flex-1 min-w-0 md:order-1">
          <p className="text-[10px] md:text-sm font-medium text-gray-600 mb-0.5 md:mb-1 truncate">{title}</p>
          <h3 className="text-sm md:text-xl lg:text-2xl font-bold text-gray-900 mb-0.5 md:mb-2 truncate">{value}</h3>
          {trendValue && (
            <div className={`hidden md:flex items-center gap-1 text-xs sm:text-sm ${
              trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-gray-600'
            }`}>
              {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'}
              <span className="truncate">{trendValue}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

