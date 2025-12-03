import React, { useEffect, useState } from 'react'
import api from '../api/api'
import TransactionTable from '../components/TransactionTable'
import InvoiceUploader from '../components/InvoiceUploader'
import Card from '../components/Card'
import Button from '../components/Button'
import Input from '../components/Input'
import { FiPlus, FiUpload, FiX, FiDollarSign, FiTag, FiCalendar, FiCreditCard, FiTrendingUp, FiTrendingDown } from 'react-icons/fi'

export default function Transactions(){
  const [txs, setTxs] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [showUpload, setShowUpload] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    description: '',
    category: '',
    amount: '',
    type: 'expense',
    date: new Date().toISOString().split('T')[0],
    card: '',
    installments: '',
    isPaid: true
  })
  
  const token = localStorage.getItem('token')

  const loadTransactions = () => {
    if(!token) return
    api.get('/transactions', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => setTxs(r.data))
      .catch(console.error)
  }

  useEffect(()=>{
    loadTransactions()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      await api.post('/transactions', {
        ...formData,
        amount: parseFloat(formData.amount),
        installments: formData.installments ? parseInt(formData.installments) : null
      }, { 
        headers: { Authorization: `Bearer ${token}` } 
      })
      
      setFormData({
        description: '',
        category: '',
        amount: '',
        type: 'expense',
        date: new Date().toISOString().split('T')[0],
        card: '',
        installments: '',
        isPaid: true
      })
      setShowForm(false)
      loadTransactions()
    } catch (err) {
      alert('Erro ao criar transação')
    } finally {
      setLoading(false)
    }
  }

  const expenseCategories = ['Alimentação', 'Transporte', 'Moradia', 'Saúde', 'Educação', 'Lazer', 'Compras', 'Outros']
  const incomeCategories = ['Salário', 'Freelance', 'Investimentos', 'Vendas', 'Bônus', 'Outros']
  
  const categories = formData.type === 'expense' ? expenseCategories : incomeCategories

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Transações</h1>
          <p className="text-gray-600 mt-1">Gerencie suas transações financeiras</p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => {
              setShowUpload(!showUpload)
              setShowForm(false)
            }}
          >
            <FiUpload size={18} />
            Upload Fatura
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              setShowForm(!showForm)
              setShowUpload(false)
            }}
          >
            <FiPlus size={18} />
            Nova Transação
          </Button>
        </div>
      </div>

      {/* Upload Section */}
      {showUpload && (
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Upload de Fatura</h3>
            <button
              onClick={() => setShowUpload(false)}
              className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FiX size={20} />
            </button>
          </div>
          <InvoiceUploader onUploaded={(data) => {
            console.log('OCR raw:', data)
            alert('Fatura processada! Texto extraído com sucesso.')
          }} />
        </Card>
      )}

      {/* Form Section */}
      {showForm && (
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Nova Transação</h3>
            <button
              onClick={() => setShowForm(false)}
              className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FiX size={20} />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Tipo de Transação */}
            <div className="flex gap-3 p-4 bg-gray-50 rounded-lg">
              <label className="flex-1">
                <input
                  type="radio"
                  name="type"
                  value="expense"
                  checked={formData.type === 'expense'}
                  onChange={(e) => setFormData({...formData, type: e.target.value, category: ''})}
                  className="sr-only peer"
                />
                <div className="flex items-center justify-center gap-2 p-3 border-2 border-gray-300 rounded-lg cursor-pointer peer-checked:border-red-500 peer-checked:bg-red-50 peer-checked:text-red-700 transition-all">
                  <FiTrendingDown size={20} />
                  <span className="font-medium">Despesa</span>
                </div>
              </label>
              
              <label className="flex-1">
                <input
                  type="radio"
                  name="type"
                  value="income"
                  checked={formData.type === 'income'}
                  onChange={(e) => setFormData({...formData, type: e.target.value, category: ''})}
                  className="sr-only peer"
                />
                <div className="flex items-center justify-center gap-2 p-3 border-2 border-gray-300 rounded-lg cursor-pointer peer-checked:border-green-500 peer-checked:bg-green-50 peer-checked:text-green-700 transition-all">
                  <FiTrendingUp size={20} />
                  <span className="font-medium">Receita</span>
                </div>
              </label>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Descrição"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder={formData.type === 'expense' ? "Ex: Compra no supermercado" : "Ex: Salário de Dezembro"}
                icon={FiDollarSign}
                required
              />
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Categoria <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <FiTag className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full px-4 py-2.5 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Selecione...</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <Input
                label="Valor"
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
              
              <Input
                label="Cartão (opcional)"
                value={formData.card}
                onChange={(e) => setFormData({...formData, card: e.target.value})}
                placeholder="Ex: Nubank"
                icon={FiCreditCard}
              />
              
              <Input
                label="Parcelas (opcional)"
                type="number"
                value={formData.installments}
                onChange={(e) => setFormData({...formData, installments: e.target.value})}
                placeholder="1"
                min="1"
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
                variant="primary"
                disabled={loading}
              >
                {loading ? 'Salvando...' : 'Salvar Transação'}
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Transactions List */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Todas as Transações</h3>
        <TransactionTable txs={txs} />
      </Card>
    </div>
  )
}
