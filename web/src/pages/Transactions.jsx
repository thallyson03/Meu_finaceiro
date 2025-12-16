import React, { useEffect, useState, useMemo } from 'react'
import api from '../api/api'
import TransactionTable from '../components/TransactionTable'
import InvoiceUploader from '../components/InvoiceUploader'
import Card from '../components/Card'
import Button from '../components/Button'
import Input from '../components/Input'
import { FiPlus, FiUpload, FiX, FiDollarSign, FiTag, FiCalendar, FiCreditCard, FiTrendingUp, FiTrendingDown, FiHash } from 'react-icons/fi'

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
    isPaid: true,
    installmentMode: 'total' // 'total' = valor total dividido | 'perInstallment' = valor por parcela
  })

  // Calcula os valores baseado no modo de parcelas
  const calculatedValues = useMemo(() => {
    const amount = parseFloat(formData.amount) || 0
    const installments = parseInt(formData.installments) || 1
    
    if (formData.installmentMode === 'perInstallment' && formData.installments) {
      // Modo: valor por parcela - calcular o total
      const totalAmount = amount * installments
      return {
        totalAmount: totalAmount,
        installmentValue: amount,
        showCalculation: true
      }
    } else if (formData.installmentMode === 'total' && formData.installments) {
      // Modo: valor total - calcular valor de cada parcela
      const installmentValue = amount / installments
      return {
        totalAmount: amount,
        installmentValue: installmentValue,
        showCalculation: true
      }
    }
    
    return {
      totalAmount: amount,
      installmentValue: amount,
      showCalculation: false
    }
  }, [formData.amount, formData.installments, formData.installmentMode])
  
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
      // Determina o valor total baseado no modo de parcelas
      const finalAmount = calculatedValues.totalAmount
      
      await api.post('/transactions', {
        ...formData,
        amount: finalAmount,
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
        isPaid: true,
        installmentMode: 'total'
      })
      setShowForm(false)
      loadTransactions()
    } catch (err) {
      alert('Erro ao criar transação')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      await api.delete(`/transactions/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      loadTransactions()
    } catch (err) {
      alert('Erro ao excluir transação')
      console.error(err)
    }
  }

  const expenseCategories = ['Alimentação', 'Transporte', 'Moradia', 'Saúde', 'Educação', 'Lazer', 'Compras', 'Outros']
  const incomeCategories = ['Salário', 'Freelance', 'Investimentos', 'Vendas', 'Bônus', 'Outros']
  
  const categories = formData.type === 'expense' ? expenseCategories : incomeCategories

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Transações</h1>
          <p className="text-gray-600 mt-1 text-sm">Gerencie suas transações financeiras</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => {
              setShowUpload(!showUpload)
              setShowForm(false)
            }}
            className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <FiUpload size={16} />
            Upload
          </button>
          <button
            onClick={() => {
              setShowForm(!showForm)
              setShowUpload(false)
            }}
            className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors"
          >
            <FiPlus size={16} />
            Nova Transação
          </button>
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
                label={formData.installments && parseInt(formData.installments) > 1 && formData.installmentMode === 'perInstallment' 
                  ? "Valor da Parcela" 
                  : "Valor"
                }
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
                icon={FiHash}
              />
            </div>
            
            {/* Modo de Parcelas - aparece quando há parcelas */}
            {formData.installments && parseInt(formData.installments) > 1 && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg space-y-4">
                <div className="flex items-center gap-2 text-blue-700">
                  <FiCreditCard size={20} />
                  <span className="font-medium">Configuração de Parcelas</span>
                </div>
                
                {/* Toggle de Modo */}
                <div className="flex gap-3">
                  <label className="flex-1">
                    <input
                      type="radio"
                      name="installmentMode"
                      value="total"
                      checked={formData.installmentMode === 'total'}
                      onChange={(e) => setFormData({...formData, installmentMode: e.target.value})}
                      className="sr-only peer"
                    />
                    <div className="flex items-center justify-center gap-2 p-3 border-2 border-gray-300 rounded-lg cursor-pointer peer-checked:border-blue-500 peer-checked:bg-blue-100 peer-checked:text-blue-700 transition-all text-sm">
                      <FiDollarSign size={18} />
                      <span className="font-medium">Valor Total</span>
                    </div>
                  </label>
                  
                  <label className="flex-1">
                    <input
                      type="radio"
                      name="installmentMode"
                      value="perInstallment"
                      checked={formData.installmentMode === 'perInstallment'}
                      onChange={(e) => setFormData({...formData, installmentMode: e.target.value})}
                      className="sr-only peer"
                    />
                    <div className="flex items-center justify-center gap-2 p-3 border-2 border-gray-300 rounded-lg cursor-pointer peer-checked:border-blue-500 peer-checked:bg-blue-100 peer-checked:text-blue-700 transition-all text-sm">
                      <FiHash size={18} />
                      <span className="font-medium">Valor por Parcela</span>
                    </div>
                  </label>
                </div>
                
                {/* Descrição do Modo Selecionado */}
                <p className="text-sm text-blue-600">
                  {formData.installmentMode === 'total' 
                    ? `O valor informado (R$ ${parseFloat(formData.amount || 0).toFixed(2)}) será dividido em ${formData.installments}x parcelas`
                    : `Cada parcela de R$ ${parseFloat(formData.amount || 0).toFixed(2)} será multiplicada por ${formData.installments}x`
                  }
                </p>
                
                {/* Resultado do Cálculo */}
                {calculatedValues.showCalculation && parseFloat(formData.amount) > 0 && (
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-blue-200">
                    <div className="text-sm text-gray-600">
                      {formData.installmentMode === 'total' ? 'Valor de cada parcela:' : 'Valor total da compra:'}
                    </div>
                    <div className="text-lg font-bold text-blue-700">
                      R$ {formData.installmentMode === 'total' 
                        ? calculatedValues.installmentValue.toFixed(2)
                        : calculatedValues.totalAmount.toFixed(2)
                      }
                    </div>
                  </div>
                )}
                
                {/* Resumo Completo */}
                {calculatedValues.showCalculation && parseFloat(formData.amount) > 0 && (
                  <div className="text-center text-sm font-medium text-blue-800 bg-blue-100 rounded-lg p-2">
                    {formData.installments}x de R$ {calculatedValues.installmentValue.toFixed(2)} = R$ {calculatedValues.totalAmount.toFixed(2)}
                  </div>
                )}
              </div>
            )}
            
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
        <TransactionTable txs={txs} onDelete={handleDelete} />
      </Card>
    </div>
  )
}
