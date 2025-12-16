import React, { useEffect, useState } from 'react'
import api from '../api/api'
import Card from '../components/Card'
import Button from '../components/Button'
import Input from '../components/Input'
import { 
  FiRepeat, FiPlus, FiEdit2, FiTrash2, FiTrendingUp, FiTrendingDown,
  FiDollarSign, FiCalendar, FiPause, FiPlay, FiX, FiRefreshCw
} from 'react-icons/fi'

const EXPENSE_CATEGORIES = [
  'Alimentação', 'Transporte', 'Moradia', 'Saúde', 'Educação', 
  'Lazer', 'Compras', 'Assinaturas', 'Contas', 'Outros'
]

const INCOME_CATEGORIES = [
  'Salário', 'Freelance', 'Investimentos', 'Vendas', 'Aluguel', 'Bônus', 'Outros'
]

const FREQUENCIES = [
  { value: 'monthly', label: 'Mensal' },
  { value: 'weekly', label: 'Semanal' },
  { value: 'yearly', label: 'Anual' }
]

const DAYS_OF_WEEK = [
  'Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'
]

export default function Recurring() {
  const [recurring, setRecurring] = useState([])
  const [accounts, setAccounts] = useState([])
  const [summary, setSummary] = useState({})
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [formData, setFormData] = useState({
    description: '',
    category: 'Outros',
    amount: '',
    type: 'expense',
    frequency: 'monthly',
    dayOfMonth: '1',
    dayOfWeek: '0',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    accountId: ''
  })
  const token = localStorage.getItem('token')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [recurringRes, accountsRes] = await Promise.all([
        api.get('/recurring', { headers: { Authorization: `Bearer ${token}` } }),
        api.get('/accounts', { headers: { Authorization: `Bearer ${token}` } }).catch(() => ({ data: { accounts: [] } }))
      ])
      setRecurring(recurringRes.data.recurring)
      setSummary(recurringRes.data.summary)
      setAccounts(accountsRes.data.accounts || [])
      setLoading(false)
    } catch (error) {
      console.error('Erro ao buscar dados:', error)
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const data = {
        ...formData,
        amount: parseFloat(formData.amount),
        dayOfMonth: formData.frequency === 'monthly' ? parseInt(formData.dayOfMonth) : null,
        dayOfWeek: formData.frequency === 'weekly' ? parseInt(formData.dayOfWeek) : null,
        accountId: formData.accountId ? parseInt(formData.accountId) : null
      }

      if (editingItem) {
        await api.put(`/recurring/${editingItem.id}`, data, {
          headers: { Authorization: `Bearer ${token}` }
        })
      } else {
        await api.post('/recurring', data, {
          headers: { Authorization: `Bearer ${token}` }
        })
      }
      fetchData()
      resetForm()
    } catch (error) {
      console.error('Erro ao salvar:', error)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Tem certeza que deseja excluir este lançamento recorrente?')) return
    try {
      await api.delete(`/recurring/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      fetchData()
    } catch (error) {
      console.error('Erro ao excluir:', error)
    }
  }

  const handleToggleStatus = async (id) => {
    try {
      await api.post(`/recurring/${id}/toggle`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      })
      fetchData()
    } catch (error) {
      console.error('Erro ao alternar status:', error)
    }
  }

  const handleGenerateTransactions = async () => {
    try {
      const response = await api.post('/recurring/generate', {}, {
        headers: { Authorization: `Bearer ${token}` }
      })
      alert(response.data.message)
      fetchData()
    } catch (error) {
      console.error('Erro ao gerar transações:', error)
    }
  }

  const resetForm = () => {
    setShowModal(false)
    setEditingItem(null)
    setFormData({
      description: '',
      category: 'Outros',
      amount: '',
      type: 'expense',
      frequency: 'monthly',
      dayOfMonth: '1',
      dayOfWeek: '0',
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
      accountId: ''
    })
  }

  const openEditModal = (item) => {
    setEditingItem(item)
    setFormData({
      description: item.description,
      category: item.category,
      amount: item.amount.toString(),
      type: item.type,
      frequency: item.frequency,
      dayOfMonth: item.dayOfMonth?.toString() || '1',
      dayOfWeek: item.dayOfWeek?.toString() || '0',
      startDate: item.startDate.split('T')[0],
      endDate: item.endDate ? item.endDate.split('T')[0] : '',
      accountId: item.accountId?.toString() || ''
    })
    setShowModal(true)
  }

  const getFrequencyLabel = (item) => {
    if (item.frequency === 'monthly') {
      return `Todo dia ${item.dayOfMonth}`
    } else if (item.frequency === 'weekly') {
      return `Toda ${DAYS_OF_WEEK[item.dayOfWeek]}`
    } else {
      return 'Anualmente'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="loading-spinner"></div>
      </div>
    )
  }

  const incomeItems = recurring.filter(r => r.type === 'income')
  const expenseItems = recurring.filter(r => r.type === 'expense')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">🔄 Lançamentos Recorrentes</h1>
          <p className="text-gray-600 mt-1">Automatize suas receitas e despesas fixas</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={handleGenerateTransactions} className="flex items-center gap-2">
            <FiRefreshCw /> Gerar Transações
          </Button>
          <Button onClick={() => setShowModal(true)} className="flex items-center gap-2">
            <FiPlus /> Novo Lançamento
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <div className="text-center">
            <FiRepeat className="mx-auto text-blue-600 mb-2" size={28} />
            <p className="text-sm text-blue-700">Total</p>
            <p className="text-2xl font-bold text-blue-900">{summary.total || 0}</p>
          </div>
        </Card>
        
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <div className="text-center">
            <FiTrendingUp className="mx-auto text-green-600 mb-2" size={28} />
            <p className="text-sm text-green-700">Receitas/Mês</p>
            <p className="text-lg font-bold text-green-900">
              R$ {(summary.monthlyIncome || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>
        </Card>
        
        <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <div className="text-center">
            <FiTrendingDown className="mx-auto text-red-600 mb-2" size={28} />
            <p className="text-sm text-red-700">Despesas/Mês</p>
            <p className="text-lg font-bold text-red-900">
              R$ {(summary.monthlyExpense || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>
        </Card>
        
        <Card className={`bg-gradient-to-br ${summary.monthlyBalance >= 0 
          ? 'from-emerald-50 to-emerald-100 border-emerald-200' 
          : 'from-orange-50 to-orange-100 border-orange-200'}`}
        >
          <div className="text-center">
            <FiDollarSign className={`mx-auto mb-2 ${summary.monthlyBalance >= 0 ? 'text-emerald-600' : 'text-orange-600'}`} size={28} />
            <p className={`text-sm ${summary.monthlyBalance >= 0 ? 'text-emerald-700' : 'text-orange-700'}`}>Balanço/Mês</p>
            <p className={`text-lg font-bold ${summary.monthlyBalance >= 0 ? 'text-emerald-900' : 'text-orange-900'}`}>
              R$ {(summary.monthlyBalance || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>
        </Card>
      </div>

      {/* Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Receitas Recorrentes */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <FiTrendingUp className="text-green-600" /> Receitas Recorrentes
            </h3>
            <span className="text-sm text-gray-500">{incomeItems.length} itens</span>
          </div>
          
          {incomeItems.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>Nenhuma receita recorrente</p>
            </div>
          ) : (
            <div className="space-y-3">
              {incomeItems.map((item) => (
                <div 
                  key={item.id} 
                  className={`p-4 rounded-xl border ${item.isActive 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-gray-50 border-gray-200 opacity-60'}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-gray-900">{item.description}</h4>
                        {!item.isActive && (
                          <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded">
                            Pausado
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{item.category}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        <FiCalendar className="inline mr-1" size={12} />
                        {getFrequencyLabel(item)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-green-600">
                        +R$ {item.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </p>
                      <div className="flex gap-1 mt-2 justify-end">
                        <button 
                          onClick={() => handleToggleStatus(item.id)}
                          className={`p-1.5 rounded-lg transition-colors ${item.isActive 
                            ? 'text-yellow-600 hover:bg-yellow-100' 
                            : 'text-green-600 hover:bg-green-100'}`}
                          title={item.isActive ? 'Pausar' : 'Ativar'}
                        >
                          {item.isActive ? <FiPause size={14} /> : <FiPlay size={14} />}
                        </button>
                        <button 
                          onClick={() => openEditModal(item)}
                          className="p-1.5 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                        >
                          <FiEdit2 size={14} />
                        </button>
                        <button 
                          onClick={() => handleDelete(item.id)}
                          className="p-1.5 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                        >
                          <FiTrash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Despesas Recorrentes */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <FiTrendingDown className="text-red-600" /> Despesas Recorrentes
            </h3>
            <span className="text-sm text-gray-500">{expenseItems.length} itens</span>
          </div>
          
          {expenseItems.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>Nenhuma despesa recorrente</p>
            </div>
          ) : (
            <div className="space-y-3">
              {expenseItems.map((item) => (
                <div 
                  key={item.id} 
                  className={`p-4 rounded-xl border ${item.isActive 
                    ? 'bg-red-50 border-red-200' 
                    : 'bg-gray-50 border-gray-200 opacity-60'}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-gray-900">{item.description}</h4>
                        {!item.isActive && (
                          <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded">
                            Pausado
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{item.category}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        <FiCalendar className="inline mr-1" size={12} />
                        {getFrequencyLabel(item)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-red-600">
                        -R$ {item.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </p>
                      <div className="flex gap-1 mt-2 justify-end">
                        <button 
                          onClick={() => handleToggleStatus(item.id)}
                          className={`p-1.5 rounded-lg transition-colors ${item.isActive 
                            ? 'text-yellow-600 hover:bg-yellow-100' 
                            : 'text-green-600 hover:bg-green-100'}`}
                          title={item.isActive ? 'Pausar' : 'Ativar'}
                        >
                          {item.isActive ? <FiPause size={14} /> : <FiPlay size={14} />}
                        </button>
                        <button 
                          onClick={() => openEditModal(item)}
                          className="p-1.5 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                        >
                          <FiEdit2 size={14} />
                        </button>
                        <button 
                          onClick={() => handleDelete(item.id)}
                          className="p-1.5 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                        >
                          <FiTrash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  {editingItem ? 'Editar Lançamento' : 'Novo Lançamento Recorrente'}
                </h2>
                <button 
                  onClick={resetForm}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                  <FiX size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Tipo */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tipo</label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, type: 'income', category: 'Salário' })}
                      className={`flex-1 py-3 px-4 rounded-xl border-2 font-medium transition-all ${
                        formData.type === 'income'
                          ? 'border-green-500 bg-green-50 text-green-700'
                          : 'border-gray-200 text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      <FiTrendingUp className="inline mr-2" /> Receita
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, type: 'expense', category: 'Outros' })}
                      className={`flex-1 py-3 px-4 rounded-xl border-2 font-medium transition-all ${
                        formData.type === 'expense'
                          ? 'border-red-500 bg-red-50 text-red-700'
                          : 'border-gray-200 text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      <FiTrendingDown className="inline mr-2" /> Despesa
                    </button>
                  </div>
                </div>

                <Input
                  label="Descrição"
                  placeholder="Ex: Aluguel, Netflix, Salário..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Valor"
                    type="number"
                    step="0.01"
                    placeholder="1500.00"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    required
                  />

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Categoria</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {(formData.type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES).map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Frequência */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Frequência</label>
                  <div className="flex gap-2">
                    {FREQUENCIES.map((freq) => (
                      <button
                        key={freq.value}
                        type="button"
                        onClick={() => setFormData({ ...formData, frequency: freq.value })}
                        className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                          formData.frequency === freq.value
                            ? 'bg-blue-100 text-blue-700 border-2 border-blue-500'
                            : 'bg-gray-100 text-gray-600 border-2 border-transparent hover:bg-gray-200'
                        }`}
                      >
                        {freq.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Dia específico */}
                {formData.frequency === 'monthly' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Dia do mês</label>
                    <select
                      value={formData.dayOfMonth}
                      onChange={(e) => setFormData({ ...formData, dayOfMonth: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                        <option key={day} value={day}>Dia {day}</option>
                      ))}
                    </select>
                  </div>
                )}

                {formData.frequency === 'weekly' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Dia da semana</label>
                    <select
                      value={formData.dayOfWeek}
                      onChange={(e) => setFormData({ ...formData, dayOfWeek: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {DAYS_OF_WEEK.map((day, idx) => (
                        <option key={idx} value={idx}>{day}</option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Data de início"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    required
                  />
                  <Input
                    label="Data de fim (opcional)"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  />
                </div>

                {/* Conta (se houver contas cadastradas) */}
                {accounts.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Conta (opcional)</label>
                    <select
                      value={formData.accountId}
                      onChange={(e) => setFormData({ ...formData, accountId: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Nenhuma conta específica</option>
                      {accounts.map((acc) => (
                        <option key={acc.id} value={acc.id}>{acc.name}</option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <Button type="button" variant="secondary" onClick={resetForm} className="flex-1">
                    Cancelar
                  </Button>
                  <Button type="submit" className="flex-1">
                    {editingItem ? 'Salvar' : 'Criar'}
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

