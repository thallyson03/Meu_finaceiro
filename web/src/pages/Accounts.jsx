import React, { useEffect, useState } from 'react'
import api from '../api/api'
import Card from '../components/Card'
import Button from '../components/Button'
import Input from '../components/Input'
import { 
  FiCreditCard, FiPlus, FiEdit2, FiTrash2, FiDollarSign, 
  FiArrowRight, FiX, FiTrendingUp, FiTrendingDown, FiSave,
  FiHome, FiBarChart2
} from 'react-icons/fi'

const ACCOUNT_TYPES = [
  { value: 'checking', label: 'Conta Corrente', icon: FiHome },
  { value: 'savings', label: 'Poupança', icon: FiSave },
  { value: 'credit', label: 'Cartão de Crédito', icon: FiCreditCard },
  { value: 'investment', label: 'Investimento', icon: FiBarChart2 }
]

const ACCOUNT_COLORS = [
  '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', 
  '#EC4899', '#06B6D4', '#84CC16', '#6366F1', '#14B8A6'
]

export default function Accounts() {
  const [accounts, setAccounts] = useState([])
  const [summary, setSummary] = useState({})
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [showTransferModal, setShowTransferModal] = useState(false)
  const [editingAccount, setEditingAccount] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    type: 'checking',
    balance: '',
    creditLimit: '',
    color: '#3B82F6'
  })
  const [transferData, setTransferData] = useState({
    fromAccountId: '',
    toAccountId: '',
    amount: '',
    description: ''
  })
  const token = localStorage.getItem('token')

  useEffect(() => {
    fetchAccounts()
  }, [])

  const fetchAccounts = async () => {
    try {
      const response = await api.get('/accounts', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setAccounts(response.data.accounts)
      setSummary(response.data.summary)
      setLoading(false)
    } catch (error) {
      console.error('Erro ao buscar contas:', error)
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingAccount) {
        await api.put(`/accounts/${editingAccount.id}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        })
      } else {
        await api.post('/accounts', formData, {
          headers: { Authorization: `Bearer ${token}` }
        })
      }
      fetchAccounts()
      resetForm()
    } catch (error) {
      console.error('Erro ao salvar conta:', error)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Tem certeza que deseja excluir esta conta?')) return
    try {
      await api.delete(`/accounts/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      fetchAccounts()
    } catch (error) {
      console.error('Erro ao excluir conta:', error)
      alert(error.response?.data?.error || 'Erro ao excluir conta')
    }
  }

  const handleTransfer = async (e) => {
    e.preventDefault()
    try {
      await api.post('/accounts/transfer', transferData, {
        headers: { Authorization: `Bearer ${token}` }
      })
      fetchAccounts()
      setShowTransferModal(false)
      setTransferData({ fromAccountId: '', toAccountId: '', amount: '', description: '' })
    } catch (error) {
      console.error('Erro ao transferir:', error)
      alert(error.response?.data?.error || 'Erro ao realizar transferência')
    }
  }

  const resetForm = () => {
    setShowModal(false)
    setEditingAccount(null)
    setFormData({
      name: '',
      type: 'checking',
      balance: '',
      creditLimit: '',
      color: '#3B82F6'
    })
  }

  const openEditModal = (account) => {
    setEditingAccount(account)
    setFormData({
      name: account.name,
      type: account.type,
      balance: account.balance.toString(),
      creditLimit: account.creditLimit?.toString() || '',
      color: account.color
    })
    setShowModal(true)
  }

  const getAccountTypeInfo = (type) => {
    return ACCOUNT_TYPES.find(t => t.value === type) || ACCOUNT_TYPES[0]
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="loading-spinner"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">🏦 Contas Bancárias</h1>
          <p className="text-gray-600 mt-1">Gerencie todas as suas contas em um só lugar</p>
        </div>
        <div className="flex gap-2">
          {accounts.length >= 2 && (
            <Button variant="secondary" onClick={() => setShowTransferModal(true)} className="flex items-center gap-2">
              <FiArrowRight /> Transferir
            </Button>
          )}
          <Button onClick={() => setShowModal(true)} className="flex items-center gap-2">
            <FiPlus /> Nova Conta
          </Button>
        </div>
      </div>

      {/* Summary - Patrimônio */}
      <Card className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <p className="text-emerald-100 text-sm">💰 Patrimônio Total</p>
            <p className="text-3xl font-bold mt-1">
              R$ {(summary.patrimonio || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
            <p className="text-xs text-emerald-200 mt-1">Não inclui cartões</p>
          </div>
          <div className="text-center">
            <p className="text-emerald-100 text-sm">Contas Correntes</p>
            <p className="text-xl font-bold mt-1">
              R$ {(summary.byType?.checking || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div className="text-center">
            <p className="text-emerald-100 text-sm">Poupança</p>
            <p className="text-xl font-bold mt-1">
              R$ {(summary.byType?.savings || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div className="text-center">
            <p className="text-emerald-100 text-sm">Investimentos</p>
            <p className="text-xl font-bold mt-1">
              R$ {(summary.byType?.investment || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>
      </Card>

      {/* Summary - Cartões de Crédito */}
      {summary.creditCards && (summary.creditCards.totalLimit > 0) && (
        <Card className="bg-gradient-to-r from-red-500 to-orange-500 text-white">
          <div className="flex items-center gap-2 mb-4">
            <FiCreditCard size={24} />
            <h3 className="text-lg font-semibold">Cartões de Crédito</h3>
          </div>
          <div className="grid grid-cols-3 gap-6">
            <div className="text-center">
              <p className="text-red-100 text-sm">Limite Total</p>
              <p className="text-xl font-bold mt-1">
                R$ {(summary.creditCards.totalLimit || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div className="text-center">
              <p className="text-red-100 text-sm">Usado</p>
              <p className="text-xl font-bold mt-1">
                R$ {(summary.creditCards.usedCredit || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div className="text-center">
              <p className="text-red-100 text-sm">Disponível</p>
              <p className="text-xl font-bold mt-1">
                R$ {(summary.creditCards.availableCredit || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>
          {/* Barra de progresso */}
          <div className="mt-4">
            <div className="w-full bg-white bg-opacity-30 rounded-full h-2">
              <div 
                className="bg-white h-2 rounded-full transition-all duration-500"
                style={{ 
                  width: `${Math.min(100, ((summary.creditCards.usedCredit || 0) / (summary.creditCards.totalLimit || 1)) * 100)}%` 
                }}
              />
            </div>
            <p className="text-xs text-red-100 mt-1 text-right">
              {((summary.creditCards.usedCredit || 0) / (summary.creditCards.totalLimit || 1) * 100).toFixed(1)}% utilizado
            </p>
          </div>
        </Card>
      )}

      {/* Accounts Grid */}
      {accounts.length === 0 ? (
        <Card className="text-center py-12">
          <FiCreditCard className="mx-auto text-gray-300 mb-4" size={64} />
          <h3 className="text-xl font-semibold text-gray-700">Nenhuma conta cadastrada</h3>
          <p className="text-gray-500 mt-2">Adicione suas contas para começar a gerenciar suas finanças!</p>
          <Button onClick={() => setShowModal(true)} className="mt-4">
            <FiPlus className="mr-2" /> Adicionar Conta
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {accounts.map((account) => {
            const typeInfo = getAccountTypeInfo(account.type)
            const TypeIcon = typeInfo.icon
            
            return (
              <Card key={account.id} className="relative overflow-hidden">
                {/* Color bar */}
                <div 
                  className="absolute top-0 left-0 right-0 h-1"
                  style={{ backgroundColor: account.color }}
                />
                
                <div className="flex items-start justify-between pt-2">
                  <div 
                    className="p-3 rounded-xl" 
                    style={{ backgroundColor: `${account.color}20` }}
                  >
                    <TypeIcon size={24} style={{ color: account.color }} />
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => openEditModal(account)}
                      className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <FiEdit2 size={16} />
                    </button>
                    <button 
                      onClick={() => handleDelete(account.id)}
                      className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                </div>

                <div className="mt-4">
                  <h3 className="text-lg font-semibold text-gray-900">{account.name}</h3>
                  <p className="text-sm text-gray-500">{typeInfo.label}</p>
                </div>

                {account.type === 'credit' ? (
                  // Exibição para cartão de crédito
                  <div className="mt-4 space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Limite</span>
                      <span className="font-semibold text-gray-900">
                        R$ {(account.creditLimit || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Usado</span>
                      <span className="font-semibold text-red-600">
                        R$ {(account.usedCredit || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Disponível</span>
                      <span className="font-semibold text-green-600">
                        R$ {((account.creditLimit || 0) - (account.usedCredit || 0)).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                    {/* Barra de uso */}
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-500 ${
                          ((account.usedCredit || 0) / (account.creditLimit || 1)) > 0.8 
                            ? 'bg-red-500' 
                            : ((account.usedCredit || 0) / (account.creditLimit || 1)) > 0.5 
                              ? 'bg-yellow-500' 
                              : 'bg-green-500'
                        }`}
                        style={{ 
                          width: `${Math.min(100, ((account.usedCredit || 0) / (account.creditLimit || 1)) * 100)}%` 
                        }}
                      />
                    </div>
                  </div>
                ) : (
                  // Exibição para contas normais
                  <div className="mt-4">
                    <p className="text-sm text-gray-500">Saldo</p>
                    <p className={`text-2xl font-bold ${account.calculatedBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      R$ {account.calculatedBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                )}

                {account.transactionCount > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-xs text-gray-500">
                      {account.transactionCount} transação(ões) vinculada(s)
                    </p>
                  </div>
                )}
              </Card>
            )
          })}
        </div>
      )}

      {/* Modal Criar/Editar Conta */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  {editingAccount ? 'Editar Conta' : 'Nova Conta'}
                </h2>
                <button 
                  onClick={resetForm}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                  <FiX size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Nome da Conta"
                  placeholder="Ex: Nubank, Itaú, Poupança..."
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Conta</label>
                  <div className="grid grid-cols-2 gap-2">
                    {ACCOUNT_TYPES.map((type) => {
                      const TypeIcon = type.icon
                      return (
                        <button
                          key={type.value}
                          type="button"
                          onClick={() => setFormData({ ...formData, type: type.value })}
                          className={`p-3 rounded-xl border-2 transition-all flex items-center gap-2 ${
                            formData.type === type.value
                              ? 'border-blue-500 bg-blue-50 text-blue-700'
                              : 'border-gray-200 text-gray-600 hover:border-gray-300'
                          }`}
                        >
                          <TypeIcon size={18} />
                          <span className="text-sm font-medium">{type.label}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {formData.type === 'credit' ? (
                  <Input
                    label="Limite do Cartão"
                    type="number"
                    step="0.01"
                    placeholder="5000.00"
                    value={formData.creditLimit}
                    onChange={(e) => setFormData({ ...formData, creditLimit: e.target.value })}
                    required
                  />
                ) : (
                  <Input
                    label="Saldo Inicial"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.balance}
                    onChange={(e) => setFormData({ ...formData, balance: e.target.value })}
                  />
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Cor</label>
                  <div className="flex gap-2 flex-wrap">
                    {ACCOUNT_COLORS.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setFormData({ ...formData, color })}
                        className={`w-8 h-8 rounded-full transition-transform ${
                          formData.color === color ? 'ring-2 ring-offset-2 ring-gray-400 scale-110' : ''
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button type="button" variant="secondary" onClick={resetForm} className="flex-1">
                    Cancelar
                  </Button>
                  <Button type="submit" className="flex-1">
                    {editingAccount ? 'Salvar' : 'Criar Conta'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal Transferência */}
      {showTransferModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Transferir entre Contas</h2>
                <button 
                  onClick={() => setShowTransferModal(false)}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                  <FiX size={20} />
                </button>
              </div>

              <form onSubmit={handleTransfer} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">De (Origem)</label>
                  <select
                    value={transferData.fromAccountId}
                    onChange={(e) => setTransferData({ ...transferData, fromAccountId: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Selecione a conta de origem</option>
                    {accounts.map((acc) => (
                      <option key={acc.id} value={acc.id}>
                        {acc.name} - R$ {acc.calculatedBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex justify-center">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <FiArrowRight className="text-blue-600" size={20} />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Para (Destino)</label>
                  <select
                    value={transferData.toAccountId}
                    onChange={(e) => setTransferData({ ...transferData, toAccountId: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Selecione a conta de destino</option>
                    {accounts.filter(acc => acc.id.toString() !== transferData.fromAccountId).map((acc) => (
                      <option key={acc.id} value={acc.id}>
                        {acc.name} - R$ {acc.calculatedBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </option>
                    ))}
                  </select>
                </div>

                <Input
                  label="Valor"
                  type="number"
                  step="0.01"
                  placeholder="100.00"
                  value={transferData.amount}
                  onChange={(e) => setTransferData({ ...transferData, amount: e.target.value })}
                  required
                />

                <Input
                  label="Descrição (opcional)"
                  placeholder="Ex: Reserva de emergência"
                  value={transferData.description}
                  onChange={(e) => setTransferData({ ...transferData, description: e.target.value })}
                />

                <div className="flex gap-3 pt-4">
                  <Button type="button" variant="secondary" onClick={() => setShowTransferModal(false)} className="flex-1">
                    Cancelar
                  </Button>
                  <Button type="submit" className="flex-1">
                    Transferir
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

