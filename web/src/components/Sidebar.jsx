import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { FiHome, FiDollarSign, FiTrendingUp, FiTarget, FiSettings, FiLogOut, FiCreditCard, FiBarChart2, FiMenu, FiX } from 'react-icons/fi'

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
    { path: '/settings', icon: FiSettings, label: 'Configurações' }
  ]

  const closeSidebar = () => setIsOpen(false)
  
  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-3 bg-white rounded-xl shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors"
      >
        <FiMenu size={24} className="text-gray-700" />
      </button>

      {/* Overlay para mobile */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-64 bg-white border-r border-gray-200 flex flex-col h-full
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Mobile Close Button */}
        <button
          onClick={closeSidebar}
          className="lg:hidden absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-700"
        >
          <FiX size={24} />
        </button>

        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl">
              <FiTrendingUp className="text-white" size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Meu</h2>
              <p className="text-sm text-gray-600 -mt-1">Planejamento</p>
            </div>
          </div>
          
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
                      ? 'bg-blue-50 text-blue-600 font-medium' 
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </nav>
        </div>
        
        <div className="mt-auto p-6 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-all duration-200 w-full"
          >
            <FiLogOut size={20} />
            <span>Sair</span>
          </button>
        </div>
      </aside>
    </>
  )
}
