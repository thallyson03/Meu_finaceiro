import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/api'
import Card from '../components/Card'
import Button from '../components/Button'
import Input from '../components/Input'
import { FiPlus, FiX, FiDollarSign, FiCalendar, FiTrendingUp } from 'react-icons/fi'

export default function Incomes(){
  const [incomes, setIncomes] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    category: 'Salário'
  })
  
  const token = localStorage.getItem('token')
  const navigate = useNavigate()
  
  const incomeCategories = ['Salário', 'Freelance', 'Investimentos', 'Vendas', 'Bônus', 'Outros']
  
  const loadIncomes = () => {
    if(!token) {
      navigate('/login')
      return
    }
    api.get('/transactions', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => {
        const incomeTransactions = r.data.filter(t => t.type === 'income')
        setIncomes(incomeTransactions)
      })
      .catch(console.error)
  }
  
  useEffect(()=>{
    loadIncomes()
  }, [])
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      await api.post('/transactions', {
        ...formData,
        amount: parseFloat(formData.amount),
        type: 'income'
      }, { 
        headers: { Authorization: `Bearer ${token}` } 
      })
      
      setFormData({
        description: '',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        category: 'Salário'
      })
      setShowForm(false)
      loadIncomes()
    } catch (err) {
      alert('Erro ao registrar receita')
    } finally {
      setLoading(false)
    }
  }
  
  const totalIncome = incomes.reduce((sum, i) => sum + i.amount, 0)
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Receitas</h1>
          <p className="text-gray-600 mt-1">Registre suas fontes de renda</p>
        </div>
        <Button
          variant="primary"
          onClick={() => setShowForm(!showForm)}
        >
          <FiPlus size={18} />
          Nova Receita
        </Button>
      </div>
      
      {/* Total */}
      <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-green-700 mb-1">Total de Receitas</p>
            <h3 className="text-3xl font-bold text-green-900">R$ {totalIncome.toFixed(2)}</h3>
            <p className="text-sm text-green-600 mt-1">{incomes.length} fontes de renda</p>
          </div>
          <div className="p-4 bg-green-100 rounded-xl">
            <FiTrendingUp className="text-green-600" size={32} />
          </div>
        </div>
      </Card>
      
      {/* Formulário */}
      {showForm && (
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Nova Receita</h3>
            <button
              onClick={() => setShowForm(false)}
              className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FiX size={20} />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Descrição"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Ex: Salário de Dezembro"
                icon={FiDollarSign}
                required
              />
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de Receita <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  {incomeCategories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              
              <Input
                label="Valor (R$)"
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) => setFormData({...formData, amount: e.target.value})}
                placeholder="0.00"
                icon={FiDollarSign}
                required
              />
              
              <Input
                label="Data"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
                icon={FiCalendar}
                required
              />
            </div>
            
            <div className="flex gap-3 justify-end pt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setShowForm(false)}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="success"
                disabled={loading}
              >
                {loading ? 'Salvando...' : 'Salvar Receita'}
              </Button>
            </div>
          </form>
        </Card>
      )}
      
      {/* Lista de Receitas */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Todas as Receitas</h3>
        {incomes.length === 0 ? (
          <div className="text-center py-12">
            <FiDollarSign size={48} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-600 mb-2">Nenhuma receita cadastrada</p>
            <p className="text-sm text-gray-500">Clique em "Nova Receita" para começar</p>
          </div>
        ) : (
          <div className="space-y-3">
            {incomes.map(income => (
              <div key={income.id} className="flex items-center justify-between p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors border border-green-100">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-100 text-green-600 rounded-lg">
                    <FiDollarSign size={20} />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{income.description}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-sm text-gray-600">
                        {new Date(income.date).toLocaleDateString('pt-BR')}
                      </span>
                      <span className="text-xs px-2 py-0.5 bg-green-200 text-green-800 rounded-full">
                        {income.category}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-green-600">
                    + R$ {income.amount.toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}
