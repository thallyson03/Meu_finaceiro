import React, { useState } from 'react'
import { FiDollarSign, FiSearch, FiFilter } from 'react-icons/fi'

export default function TransactionTable({ txs }){
  const [search, setSearch] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')
  
  // Filtrar transações
  const filteredTxs = txs.filter(tx => {
    const matchSearch = tx.description.toLowerCase().includes(search.toLowerCase()) ||
                       tx.category.toLowerCase().includes(search.toLowerCase())
    const matchCategory = filterCategory === 'all' || tx.category === filterCategory
    return matchSearch && matchCategory
  })
  
  // Obter categorias únicas
  const categories = ['all', ...new Set(txs.map(tx => tx.category))]
  
  if (txs.length === 0) {
    return (
      <div className="text-center py-12">
        <FiDollarSign size={48} className="mx-auto text-gray-300 mb-3" />
        <p className="text-gray-600 mb-2">Nenhuma transação cadastrada</p>
        <p className="text-sm text-gray-500">Clique em "Nova Transação" para começar</p>
      </div>
    )
  }
  
  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Buscar transações..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <div className="relative min-w-[200px]">
          <FiFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer"
          >
            <option value="all">Todas Categorias</option>
            {categories.slice(1).map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>
      
      {/* Table for desktop */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descrição</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoria</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cartão</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Valor</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredTxs.map(t => (
              <tr key={t.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                  {new Date(t.date).toLocaleDateString('pt-BR')}
                </td>
                <td className="px-4 py-4 text-sm text-gray-900 font-medium">
                  {t.description}
                  {t.installments && (
                    <span className="ml-2 text-xs text-gray-500">({t.installments}x)</span>
                  )}
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {t.category}
                  </span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                  {t.card || '-'}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-right font-semibold text-gray-900">
                  R$ {Math.abs(Number(t.amount)).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Cards for mobile */}
      <div className="md:hidden space-y-3">
        {filteredTxs.map(t => (
          <div key={t.id} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
            <div className="flex justify-between items-start mb-2">
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{t.description}</h4>
                <p className="text-sm text-gray-600 mt-1">
                  {new Date(t.date).toLocaleDateString('pt-BR')}
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900">
                  R$ {Math.abs(Number(t.amount)).toFixed(2)}
                </p>
                {t.installments && (
                  <p className="text-xs text-gray-500">{t.installments}x</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2 mt-3">
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {t.category}
              </span>
              {t.card && (
                <span className="text-xs text-gray-600">{t.card}</span>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {filteredTxs.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>Nenhuma transação encontrada com esses filtros</p>
        </div>
      )}
      
      <div className="text-sm text-gray-600 text-center pt-4 border-t border-gray-200">
        Mostrando {filteredTxs.length} de {txs.length} transações
      </div>
    </div>
  )
}
