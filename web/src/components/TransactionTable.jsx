import React, { useState } from 'react'
import { FiDollarSign, FiSearch, FiFilter, FiTrash2, FiCheck, FiClock, FiCreditCard } from 'react-icons/fi'

export default function TransactionTable({ txs, onDelete, onPay, onReceive, accounts = [], creditCards = [] }){
  const [search, setSearch] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')
  const [payModal, setPayModal] = useState({ show: false, transaction: null })
  const [selectedAccountId, setSelectedAccountId] = useState('')

  const handlePayClick = (transaction) => {
    setPayModal({ show: true, transaction })
    setSelectedAccountId('')
  }

  const handleConfirmPay = () => {
    if (!selectedAccountId) {
      alert('Selecione uma conta')
      return
    }
    const action = payModal.transaction.type === 'income' ? onReceive : onPay
    if (action) {
      action(payModal.transaction.id, parseInt(selectedAccountId))
    }
    setPayModal({ show: false, transaction: null })
  }

  const allAccounts = [
    ...accounts.map(a => ({ ...a, isCredit: false })),
    ...creditCards.map(c => ({ ...c, isCredit: true, availableCredit: (c.creditLimit || 0) - (c.usedCredit || 0) }))
  ]
  
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
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cartão</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Valor</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
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
                <td className="px-4 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                    t.type === 'income' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {t.type === 'income' ? 'Receita' : 'Despesa'}
                  </span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                  {t.card || '-'}
                </td>
                <td className={`px-4 py-4 whitespace-nowrap text-sm text-right font-semibold ${
                  t.type === 'income' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {t.type === 'income' ? '+' : '-'} R$ {Math.abs(Number(t.amount)).toFixed(2)}
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                    t.isPaid 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {t.isPaid ? <FiCheck size={12} /> : <FiClock size={12} />}
                    {t.isPaid ? 'Pago' : 'Pendente'}
                  </span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-center">
                  <div className="flex items-center justify-center gap-1">
                    {!t.isPaid && (onPay || onReceive) && (
                      <button
                        onClick={() => handlePayClick(t)}
                        className="p-1.5 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
                        title={t.type === 'income' ? 'Receber' : 'Pagar'}
                      >
                        <FiCreditCard size={16} />
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => {
                          if (window.confirm('Tem certeza que deseja excluir esta transação?')) {
                            onDelete(t.id)
                          }
                        }}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Excluir transação"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    )}
                  </div>
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
                <div className="flex items-center gap-2">
                  <h4 className="font-medium text-gray-900">{t.description}</h4>
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                    t.isPaid 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {t.isPaid ? <FiCheck size={10} /> : <FiClock size={10} />}
                    {t.isPaid ? 'Pago' : 'Pendente'}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {new Date(t.date).toLocaleDateString('pt-BR')}
                </p>
              </div>
              <div className="text-right">
                <p className={`font-semibold ${t.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                  {t.type === 'income' ? '+' : '-'} R$ {Math.abs(Number(t.amount)).toFixed(2)}
                </p>
                {t.installments && (
                  <p className="text-xs text-gray-500">{t.installments}x</p>
                )}
              </div>
            </div>
            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                  t.type === 'income' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {t.type === 'income' ? 'Receita' : 'Despesa'}
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {t.category}
                </span>
                {t.card && (
                  <span className="text-xs text-gray-600">{t.card}</span>
                )}
              </div>
              <div className="flex items-center gap-1">
                {!t.isPaid && (onPay || onReceive) && (
                  <button
                    onClick={() => handlePayClick(t)}
                    className="p-2 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
                    title={t.type === 'income' ? 'Receber' : 'Pagar'}
                  >
                    <FiCreditCard size={18} />
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={() => {
                      if (window.confirm('Tem certeza que deseja excluir esta transação?')) {
                        onDelete(t.id)
                      }
                    }}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Excluir"
                  >
                    <FiTrash2 size={18} />
                  </button>
                )}
              </div>
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

      {/* Modal de Pagamento */}
      {payModal.show && payModal.transaction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">
              {payModal.transaction.type === 'income' ? '💰 Receber Receita' : '💳 Pagar Despesa'}
            </h3>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <p className="font-medium text-gray-900">{payModal.transaction.description}</p>
              <p className={`text-lg font-bold mt-1 ${
                payModal.transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
              }`}>
                R$ {Math.abs(Number(payModal.transaction.amount)).toFixed(2)}
              </p>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {payModal.transaction.type === 'income' 
                  ? 'Receber em qual conta?' 
                  : 'Pagar com qual conta/cartão?'}
              </label>
              <select
                value={selectedAccountId}
                onChange={(e) => setSelectedAccountId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="">Selecione...</option>
                {payModal.transaction.type === 'income' ? (
                  // Para receitas, só mostrar contas (não cartões)
                  accounts.map(acc => (
                    <option key={acc.id} value={acc.id}>
                      {acc.name} - Saldo: R$ {acc.balance.toFixed(2)}
                    </option>
                  ))
                ) : (
                  // Para despesas, mostrar contas e cartões
                  <>
                    <optgroup label="Contas">
                      {accounts.map(acc => (
                        <option key={acc.id} value={acc.id}>
                          {acc.name} - Saldo: R$ {acc.balance.toFixed(2)}
                        </option>
                      ))}
                    </optgroup>
                    {creditCards.length > 0 && (
                      <optgroup label="Cartões de Crédito">
                        {creditCards.map(card => (
                          <option key={card.id} value={card.id}>
                            {card.name} - Disponível: R$ {((card.creditLimit || 0) - (card.usedCredit || 0)).toFixed(2)}
                          </option>
                        ))}
                      </optgroup>
                    )}
                  </>
                )}
              </select>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setPayModal({ show: false, transaction: null })}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmPay}
                className="flex-1 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
              >
                {payModal.transaction.type === 'income' ? 'Receber' : 'Pagar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
