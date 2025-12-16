import React from 'react'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'

const MONTH_NAMES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
]

const MONTH_NAMES_SHORT = [
  'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
  'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
]

export default function MonthSelector({ 
  selectedMonth, 
  selectedYear, 
  onPreviousMonth, 
  onNextMonth, 
  onGoToCurrentMonth,
  variant = 'default' // 'default', 'compact', 'hero'
}) {
  const now = new Date()
  const isCurrentMonth = selectedMonth === (now.getMonth() + 1) && selectedYear === now.getFullYear()

  // Variante Hero (para Dashboard)
  if (variant === 'hero') {
    return (
      <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl p-4 shadow-lg">
        <div className="flex items-center justify-between">
          <button
            onClick={onPreviousMonth}
            className="p-2 hover:bg-white/20 rounded-full transition-colors"
            title="Mês anterior"
          >
            <FiChevronLeft size={24} className="text-white" />
          </button>
          
          <div className="flex flex-col items-center">
            <span className="text-2xl sm:text-3xl font-bold text-white">
              {MONTH_NAMES[selectedMonth - 1]}
            </span>
            <span className="text-sm text-white/80">{selectedYear}</span>
          </div>
          
          <button
            onClick={onNextMonth}
            className="p-2 hover:bg-white/20 rounded-full transition-colors"
            title="Próximo mês"
          >
            <FiChevronRight size={24} className="text-white" />
          </button>
        </div>
        
        {/* Indicador visual do mês */}
        <div className="flex justify-center gap-1 mt-3">
          {MONTH_NAMES.map((_, idx) => (
            <div
              key={idx}
              className={`h-1.5 rounded-full transition-all ${
                idx + 1 === selectedMonth 
                  ? 'w-6 bg-white' 
                  : 'w-1.5 bg-white/30'
              }`}
            />
          ))}
        </div>
      </div>
    )
  }

  // Variante Compacta (para páginas internas)
  if (variant === 'compact') {
    return (
      <div className="flex items-center gap-2">
        <div className="flex items-center bg-white rounded-lg shadow-sm border border-gray-200">
          <button
            onClick={onPreviousMonth}
            className="p-2 hover:bg-gray-100 rounded-l-lg transition-colors border-r border-gray-200"
            title="Mês anterior"
          >
            <FiChevronLeft size={18} className="text-gray-600" />
          </button>
          
          <div className="flex items-center gap-2 px-3 py-1.5 min-w-[120px] justify-center">
            <span className="text-sm font-semibold text-gray-900">
              {MONTH_NAMES_SHORT[selectedMonth - 1]}
            </span>
            <span className="text-sm text-gray-500">{selectedYear}</span>
          </div>
          
          <button
            onClick={onNextMonth}
            className="p-2 hover:bg-gray-100 rounded-r-lg transition-colors border-l border-gray-200"
            title="Próximo mês"
          >
            <FiChevronRight size={18} className="text-gray-600" />
          </button>
        </div>
        
        {!isCurrentMonth && (
          <button
            onClick={onGoToCurrentMonth}
            className="px-3 py-2 text-xs font-medium text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors"
          >
            Hoje
          </button>
        )}
      </div>
    )
  }

  // Variante Default
  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center bg-white rounded-xl shadow-sm border border-gray-200 p-1">
        <button
          onClick={onPreviousMonth}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          title="Mês anterior"
        >
          <FiChevronLeft size={20} className="text-gray-600" />
        </button>
        
        <div className="flex flex-col items-center min-w-[130px] px-2">
          <span className="text-base font-bold text-gray-900">
            {MONTH_NAMES[selectedMonth - 1]}
          </span>
          <span className="text-xs text-gray-500">{selectedYear}</span>
        </div>
        
        <button
          onClick={onNextMonth}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          title="Próximo mês"
        >
          <FiChevronRight size={20} className="text-gray-600" />
        </button>
      </div>
      
      {!isCurrentMonth && (
        <button
          onClick={onGoToCurrentMonth}
          className="px-3 py-2 text-sm font-medium text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors border border-emerald-200"
        >
          Hoje
        </button>
      )}
    </div>
  )
}

// Hook para gerenciar estado do mês
export function useMonthSelector() {
  const now = new Date()
  const [selectedMonth, setSelectedMonth] = React.useState(now.getMonth() + 1)
  const [selectedYear, setSelectedYear] = React.useState(now.getFullYear())

  const goToPreviousMonth = () => {
    if (selectedMonth === 1) {
      setSelectedMonth(12)
      setSelectedYear(selectedYear - 1)
    } else {
      setSelectedMonth(selectedMonth - 1)
    }
  }

  const goToNextMonth = () => {
    if (selectedMonth === 12) {
      setSelectedMonth(1)
      setSelectedYear(selectedYear + 1)
    } else {
      setSelectedMonth(selectedMonth + 1)
    }
  }

  const goToCurrentMonth = () => {
    setSelectedMonth(now.getMonth() + 1)
    setSelectedYear(now.getFullYear())
  }

  const isCurrentMonth = selectedMonth === (now.getMonth() + 1) && selectedYear === now.getFullYear()

  return {
    selectedMonth,
    selectedYear,
    goToPreviousMonth,
    goToNextMonth,
    goToCurrentMonth,
    isCurrentMonth,
    monthName: MONTH_NAMES[selectedMonth - 1],
    monthNameShort: MONTH_NAMES_SHORT[selectedMonth - 1]
  }
}

export { MONTH_NAMES, MONTH_NAMES_SHORT }

