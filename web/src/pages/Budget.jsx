import React, { useEffect, useState } from 'react'
import api from '../api/api'
import Card from '../components/Card'
import Button from '../components/Button'
import Input from '../components/Input'
import { FiDollarSign, FiTrendingUp, FiTrendingDown, FiAlertCircle, FiCheckCircle, FiPlus, FiTrash2 } from 'react-icons/fi'

export default function Budget(){
  const [budgets, setBudgets] = useState([])
  const [summary, setSummary] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    category: '',
    limit: ''
  })
  const token = localStorage.getItem('token')
  
  const categories = ['Alimentação', 'Transporte', 'Moradia', 'Saúde', 'Educação', 'Lazer', 'Compras', 'Outros']
  
  const loadData = () => {
    const headers = { headers: { Authorization: `Bearer ${token}` } }
    Promise.all([
      api.get('/budget/current', headers),
      api.get('/budget/summary', headers)
    ]).then(([budgetRes, summaryRes]) => {
      setBudgets(budgetRes.data)
      setSummary(summaryRes.data)
    }).catch(console.error)
  }
  
  useEffect(()=>{
    loadData()
  }, [])
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    const now = new Date()
    await api.post('/budget', {
      ...formData,
      month: now.getMonth() + 1,
      year: now.getFullYear()
    }, { headers: { Authorization: `Bearer ${token}` } })
    
    setFormData({ category: '', limit: '' })
    setShowForm(false)
    loadData()
  }
  
  const handleDelete = async (id) => {
    if(!confirm('Deletar este orçamento?')) return
    await api.delete(`/budget/${id}`, { headers: { Authorization: `Bearer ${token}` } })
    loadData()
  }
  
  if(!summary) return <div className="flex justify-center items-center h-full"><div className="loading-spinner"></div></div>
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Orçamento Mensal</h1>
          <p className="text-gray-600 mt-1">Defina limites e acompanhe seus gastos</p>
        </div>
        <Button variant="primary" onClick={() => setShowForm(!showForm)}>
          <FiPlus size={18} />
          Novo Limite
        </Button>
      </div>
      
      {/* Resumo Financeiro */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-green-700 mb-1">Receitas</p>
              <h3 className="text-2xl font-bold text-green-900">R$ {summary.totalIncome.toFixed(2)}</h3>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <FiTrendingUp className="text-green-600" size={24} />
            </div>
          </div>
        </Card>
        
        <Card className="bg-gradient-to-br from-red-50 to-rose-50 border-red-200">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-red-700 mb-1">Despesas</p>
              <h3 className="text-2xl font-bold text-red-900">R$ {summary.totalExpense.toFixed(2)}</h3>
            </div>
            <div className="p-3 bg-red-100 rounded-lg">
              <FiTrendingDown className="text-red-600" size={24} />
            </div>
          </div>
        </Card>
        
        <Card className={`bg-gradient-to-br ${summary.balance >= 0 ? 'from-blue-50 to-indigo-50 border-blue-200' : 'from-orange-50 to-red-50 border-orange-200'}`}>
          <div className="flex items-start justify-between">
            <div>
              <p className={`text-sm font-medium ${summary.balance >= 0 ? 'text-blue-700' : 'text-orange-700'} mb-1`}>Saldo</p>
              <h3 className={`text-2xl font-bold ${summary.balance >= 0 ? 'text-blue-900' : 'text-orange-900'}`}>
                R$ {Math.abs(summary.balance).toFixed(2)}
              </h3>
            </div>
            <div className={`p-3 ${summary.balance >= 0 ? 'bg-blue-100' : 'bg-orange-100'} rounded-lg`}>
              <FiDollarSign className={summary.balance >= 0 ? 'text-blue-600' : 'text-orange-600'} size={24} />
            </div>
          </div>
        </Card>
        
        <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-purple-700 mb-1">Disponível</p>
              <h3 className="text-2xl font-bold text-purple-900">R$ {summary.availableToSpend.toFixed(2)}</h3>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <FiCheckCircle className="text-purple-600" size={24} />
            </div>
          </div>
        </Card>
      </div>
      
      {/* Formulário */}
      {showForm && (
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Definir Limite de Orçamento</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Selecione...</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              
              <Input
                label="Limite Mensal (R$)"
                type="number"
                step="0.01"
                value={formData.limit}
                onChange={(e) => setFormData({...formData, limit: e.target.value})}
                placeholder="0.00"
                required
              />
            </div>
            
            <div className="flex gap-3 justify-end">
              <Button type="button" variant="secondary" onClick={() => setShowForm(false)}>
                Cancelar
              </Button>
              <Button type="submit" variant="primary">
                Salvar Orçamento
              </Button>
            </div>
          </form>
        </Card>
      )}
      
      {/* Lista de Orçamentos */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Orçamentos por Categoria</h3>
        {summary.budgetComparison.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <FiAlertCircle size={48} className="mx-auto mb-2 text-gray-300" />
            <p>Nenhum orçamento definido</p>
            <p className="text-sm">Clique em "Novo Limite" para começar</p>
          </div>
        ) : (
          <div className="space-y-4">
            {summary.budgetComparison.map((item, idx) => (
              <div key={idx} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h4 className="font-semibold text-gray-900">{item.category}</h4>
                      {item.status === 'exceeded' && (
                        <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-medium rounded-full">
                          Excedido
                        </span>
                      )}
                      {item.status === 'warning' && (
                        <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full">
                          Atenção
                        </span>
                      )}
                      {item.status === 'ok' && (
                        <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                          OK
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                      <span>Limite: R$ {item.limit.toFixed(2)}</span>
                      <span>Gasto: R$ {item.spent.toFixed(2)}</span>
                      <span className={item.remaining >= 0 ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
                        {item.remaining >= 0 ? 'Disponível' : 'Acima'}: R$ {Math.abs(item.remaining).toFixed(2)}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(budgets.find(b => b.category === item.category)?.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <FiTrash2 size={18} />
                  </button>
                </div>
                
                <div className="relative">
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full transition-all duration-500 ${
                        item.status === 'exceeded' ? 'bg-red-500' :
                        item.status === 'warning' ? 'bg-yellow-500' :
                        'bg-green-500'
                      }`}
                      style={{ width: `${Math.min(item.percentage, 100)}%` }}
                    />
                  </div>
                  <span className="absolute right-0 top-4 text-sm font-medium text-gray-700">
                    {item.percentage.toFixed(0)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}
