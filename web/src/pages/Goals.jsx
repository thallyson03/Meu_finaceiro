import React, { useEffect, useState } from 'react'
import api from '../api/api'
import Card from '../components/Card'
import Button from '../components/Button'
import Input from '../components/Input'
import { 
  FiTarget, FiPlus, FiEdit2, FiTrash2, FiTrendingUp, 
  FiDollarSign, FiCalendar, FiCheckCircle, FiX, FiAward,
  FiHome, FiBook, FiHeart, FiGift, FiStar, FiSun, FiUmbrella, FiShoppingBag
} from 'react-icons/fi'

const GOAL_ICONS = {
  'piggy-bank': FiDollarSign,
  'home': FiHome,
  'car': FiShoppingBag,
  'book': FiBook,
  'heart': FiHeart,
  'gift': FiGift,
  'target': FiTarget,
  'award': FiAward
}

const GOAL_COLORS = [
  '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', 
  '#EC4899', '#06B6D4', '#84CC16'
]

const GOAL_CATEGORIES = [
  'Viagem', 'Reserva de Emergência', 'Carro', 'Casa', 
  'Educação', 'Saúde', 'Investimento', 'Outros'
]

export default function Goals() {
  const [goals, setGoals] = useState([])
  const [summary, setSummary] = useState({})
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingGoal, setEditingGoal] = useState(null)
  const [selectedGoal, setSelectedGoal] = useState(null)
  const [addAmount, setAddAmount] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    targetAmount: '',
    currentAmount: '',
    deadline: '',
    category: 'Outros',
    color: '#3B82F6',
    icon: 'target'
  })
  const token = localStorage.getItem('token')

  useEffect(() => {
    fetchGoals()
  }, [])

  const fetchGoals = async () => {
    try {
      const response = await api.get('/goals', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setGoals(response.data.goals)
      setSummary(response.data.summary)
      setLoading(false)
    } catch (error) {
      console.error('Erro ao buscar metas:', error)
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingGoal) {
        await api.put(`/goals/${editingGoal.id}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        })
      } else {
        await api.post('/goals', formData, {
          headers: { Authorization: `Bearer ${token}` }
        })
      }
      fetchGoals()
      resetForm()
    } catch (error) {
      console.error('Erro ao salvar meta:', error)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Tem certeza que deseja excluir esta meta?')) return
    try {
      await api.delete(`/goals/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      fetchGoals()
    } catch (error) {
      console.error('Erro ao excluir meta:', error)
    }
  }

  const handleAddToGoal = async () => {
    if (!addAmount || !selectedGoal) return
    try {
      await api.post(`/goals/${selectedGoal.id}/add`, 
        { amount: parseFloat(addAmount) },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      fetchGoals()
      setShowAddModal(false)
      setAddAmount('')
      setSelectedGoal(null)
    } catch (error) {
      console.error('Erro ao adicionar valor:', error)
    }
  }

  const resetForm = () => {
    setShowModal(false)
    setEditingGoal(null)
    setFormData({
      name: '',
      targetAmount: '',
      currentAmount: '',
      deadline: '',
      category: 'Outros',
      color: '#3B82F6',
      icon: 'target'
    })
  }

  const openEditModal = (goal) => {
    setEditingGoal(goal)
    setFormData({
      name: goal.name,
      targetAmount: goal.targetAmount,
      currentAmount: goal.currentAmount,
      deadline: goal.deadline ? goal.deadline.split('T')[0] : '',
      category: goal.category,
      color: goal.color,
      icon: goal.icon
    })
    setShowModal(true)
  }

  const openAddModal = (goal) => {
    setSelectedGoal(goal)
    setShowAddModal(true)
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
          <h1 className="text-3xl font-bold text-gray-900">🎯 Metas Financeiras</h1>
          <p className="text-gray-600 mt-1">Defina objetivos e acompanhe seu progresso</p>
        </div>
        <Button onClick={() => setShowModal(true)} className="flex items-center gap-2">
          <FiPlus /> Nova Meta
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <div className="text-center">
            <FiTarget className="mx-auto text-blue-600 mb-2" size={28} />
            <p className="text-sm text-blue-700">Total de Metas</p>
            <p className="text-2xl font-bold text-blue-900">{summary.totalGoals || 0}</p>
          </div>
        </Card>
        
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <div className="text-center">
            <FiCheckCircle className="mx-auto text-green-600 mb-2" size={28} />
            <p className="text-sm text-green-700">Concluídas</p>
            <p className="text-2xl font-bold text-green-900">{summary.completedGoals || 0}</p>
          </div>
        </Card>
        
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <div className="text-center">
            <FiDollarSign className="mx-auto text-purple-600 mb-2" size={28} />
            <p className="text-sm text-purple-700">Total Poupado</p>
            <p className="text-xl font-bold text-purple-900">
              R$ {(summary.totalCurrentAmount || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>
        </Card>
        
        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <div className="text-center">
            <FiTrendingUp className="mx-auto text-orange-600 mb-2" size={28} />
            <p className="text-sm text-orange-700">Progresso Geral</p>
            <p className="text-2xl font-bold text-orange-900">
              {(summary.overallProgress || 0).toFixed(0)}%
            </p>
          </div>
        </Card>
      </div>

      {/* Goals Grid */}
      {goals.length === 0 ? (
        <Card className="text-center py-12">
          <FiTarget className="mx-auto text-gray-300 mb-4" size={64} />
          <h3 className="text-xl font-semibold text-gray-700">Nenhuma meta cadastrada</h3>
          <p className="text-gray-500 mt-2">Crie sua primeira meta e comece a poupar!</p>
          <Button onClick={() => setShowModal(true)} className="mt-4">
            <FiPlus className="mr-2" /> Criar Meta
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {goals.map((goal) => {
            const IconComponent = GOAL_ICONS[goal.icon] || FiTarget
            const isCompleted = goal.isCompleted
            
            return (
              <Card 
                key={goal.id} 
                className={`relative overflow-hidden ${isCompleted ? 'ring-2 ring-green-500' : ''}`}
              >
                {isCompleted && (
                  <div className="absolute top-0 right-0 bg-green-500 text-white px-3 py-1 text-xs font-bold rounded-bl-lg">
                    ✓ Concluída!
                  </div>
                )}
                
                <div className="flex items-start justify-between mb-4">
                  <div 
                    className="p-3 rounded-xl" 
                    style={{ backgroundColor: `${goal.color}20` }}
                  >
                    <IconComponent size={24} style={{ color: goal.color }} />
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => openEditModal(goal)}
                      className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <FiEdit2 size={16} />
                    </button>
                    <button 
                      onClick={() => handleDelete(goal.id)}
                      className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-1">{goal.name}</h3>
                <p className="text-sm text-gray-500 mb-4">{goal.category}</p>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">
                      R$ {goal.currentAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                    <span className="font-medium" style={{ color: goal.color }}>
                      {goal.progress.toFixed(0)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="h-3 rounded-full transition-all duration-500"
                      style={{ 
                        width: `${Math.min(goal.progress, 100)}%`,
                        backgroundColor: goal.color 
                      }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Meta: R$ {goal.targetAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                    <span>Falta: R$ {goal.remaining.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  </div>
                </div>

                {/* Deadline */}
                {goal.deadline && (
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                    <FiCalendar size={14} />
                    <span>Prazo: {new Date(goal.deadline).toLocaleDateString('pt-BR')}</span>
                  </div>
                )}

                {/* Monthly Needed */}
                {goal.monthlyNeeded && !isCompleted && (
                  <div className="bg-blue-50 rounded-lg p-3 mb-4">
                    <p className="text-xs text-blue-700">
                      💡 Poupe <strong>R$ {goal.monthlyNeeded.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong>/mês para atingir a meta
                    </p>
                  </div>
                )}

                {/* Add Money Button */}
                {!isCompleted && (
                  <Button 
                    onClick={() => openAddModal(goal)}
                    className="w-full"
                    style={{ backgroundColor: goal.color }}
                  >
                    <FiPlus className="mr-2" /> Adicionar Valor
                  </Button>
                )}
              </Card>
            )
          })}
        </div>
      )}

      {/* Modal Criar/Editar Meta */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  {editingGoal ? 'Editar Meta' : 'Nova Meta'}
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
                  label="Nome da Meta"
                  placeholder="Ex: Viagem para a praia"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Valor Alvo"
                    type="number"
                    step="0.01"
                    placeholder="5000.00"
                    value={formData.targetAmount}
                    onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
                    required
                  />
                  <Input
                    label="Valor Atual"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.currentAmount}
                    onChange={(e) => setFormData({ ...formData, currentAmount: e.target.value })}
                  />
                </div>

                <Input
                  label="Prazo (opcional)"
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Categoria</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {GOAL_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Cor</label>
                  <div className="flex gap-2 flex-wrap">
                    {GOAL_COLORS.map((color) => (
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ícone</label>
                  <div className="flex gap-2 flex-wrap">
                    {Object.entries(GOAL_ICONS).map(([key, Icon]) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setFormData({ ...formData, icon: key })}
                        className={`p-3 rounded-xl transition-all ${
                          formData.icon === key 
                            ? 'bg-blue-100 text-blue-600 ring-2 ring-blue-500' 
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        <Icon size={20} />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button type="button" variant="secondary" onClick={resetForm} className="flex-1">
                    Cancelar
                  </Button>
                  <Button type="submit" className="flex-1">
                    {editingGoal ? 'Salvar' : 'Criar Meta'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal Adicionar Valor */}
      {showAddModal && selectedGoal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Adicionar Valor</h2>
                <button 
                  onClick={() => { setShowAddModal(false); setAddAmount(''); setSelectedGoal(null); }}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                  <FiX size={20} />
                </button>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <p className="text-sm text-gray-600">Meta:</p>
                <p className="font-semibold text-gray-900">{selectedGoal.name}</p>
                <p className="text-sm text-gray-500 mt-1">
                  Atual: R$ {selectedGoal.currentAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} / 
                  R$ {selectedGoal.targetAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>

              <Input
                label="Valor a adicionar"
                type="number"
                step="0.01"
                placeholder="100.00"
                value={addAmount}
                onChange={(e) => setAddAmount(e.target.value)}
                autoFocus
              />

              <div className="flex gap-3 mt-6">
                <Button 
                  type="button" 
                  variant="secondary" 
                  onClick={() => { setShowAddModal(false); setAddAmount(''); setSelectedGoal(null); }}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button onClick={handleAddToGoal} className="flex-1">
                  Adicionar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

