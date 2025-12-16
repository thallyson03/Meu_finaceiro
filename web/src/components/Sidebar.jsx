import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { FiHome, FiDollarSign, FiTrendingUp, FiTarget, FiSettings, FiLogOut, FiCreditCard, FiBarChart2, FiMenu, FiX, FiRepeat, FiAward, FiBriefcase } from 'react-icons/fi'

export default function Sidebar(){
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  
  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }
  
  const menuItems = [
    { path: '/dashboard', icon: FiHome, label: 'Dashboard' },
    { path: '/transactions', icon: FiDollarSign, label: 'Transações' },
    { path: '/incomes', icon: FiTrendingUp, label: 'Receitas' },
    { path: '/budget', icon: FiTarget, label: 'Orçamento' },
    { path: '/installments', icon: FiCreditCard, label: 'Parcelas' },
    { path: '/balance', icon: FiBarChart2, label: 'Balanceamento' },
    { path: '/goals', icon: FiAward, label: 'Metas', isNew: true },
    { path: '/recurring', icon: FiRepeat, label: 'Recorrentes', isNew: true },
    { path: '/accounts', icon: FiBriefcase, label: 'Contas', isNew: true },
    { path: '/settings', icon: FiSettings, label: 'Configurações' }
  ]

  const closeSidebar = () => setIsOpen(false)
  
  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-3 bg-[#1A1D1E] rounded-xl shadow-lg hover:bg-[#2D3436] transition-colors"
      >
        <FiMenu size={24} className="text-white" />
      </button>

      {/* Overlay para mobile */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar - Estilo Mobills (escuro) */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-64 bg-[#1A1D1E] flex flex-col h-full
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Mobile Close Button */}
        <button
          onClick={closeSidebar}
          className="lg:hidden absolute top-4 right-4 p-2 text-gray-400 hover:text-white"
        >
          <FiX size={24} />
        </button>

        <div className="p-6">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2.5 bg-[#00D09C] rounded-xl">
              <FiDollarSign className="text-white" size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Meu</h2>
              <p className="text-sm text-[#00D09C] -mt-1 font-medium">Financeiro</p>
            </div>
          </div>
          
          {/* Menu */}
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path
              const Icon = item.icon
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={closeSidebar}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    isActive 
                      ? 'bg-[#00D09C] text-white font-medium' 
                      : 'text-gray-400 hover:bg-[#2D3436] hover:text-white'
                  }`}
                >
                  <Icon size={20} />
                  <span className="flex-1">{item.label}</span>
                  {item.isNew && (
                    <span className="px-1.5 py-0.5 text-[9px] font-bold bg-[#FF6B6B] text-white rounded-full">
                      NEW
                    </span>
                  )}
                </Link>
              )
            })}
          </nav>
        </div>
        
        {/* Footer */}
        <div className="mt-auto p-6 border-t border-[#2D3436]">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-[#2D3436] hover:text-[#FF6B6B] transition-all duration-200 w-full"
          >
            <FiLogOut size={20} />
            <span>Sair</span>
          </button>
        </div>
      </aside>
    </>
  )
}
