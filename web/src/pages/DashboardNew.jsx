import React, { useEffect, useState } from 'react'
import api from '../api/api'
import StatCard from '../components/StatCard'
import Card from '../components/Card'
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts'
import { FiDollarSign, FiTrendingUp, FiTrendingDown, FiTarget, FiCreditCard, FiCheckCircle, FiAlertCircle } from 'react-icons/fi'

export default function Dashboard(){
  const [financialData, setFinancialData] = useState(null)
  const [loading, setLoading] = useState(true)
  const token = localStorage.getItem('token')

  useEffect(()=>{
    if(!token) return
    
    const currentMonth = new Date().getMonth() + 1
    const currentYear = new Date().getFullYear()
    
    Promise.all([
      api.get('/transactions', { headers: { Authorization: `Bearer ${token}` } }),
      api.get(`/incomes/summary?month=${currentMonth}&year=${currentYear}`, { headers: { Authorization: `Bearer ${token}` } }),
      api.get(`/budgets/comparison?month=${currentMonth}&year=${currentYear}`, { headers: { Authorization: `Bearer ${token}` } })
    ])
      .then(([txRes, incomesRes, budgetRes]) => {
        const transactions = txRes.data
        const expenses = transactions.filter(t => t.type === 'expense')
        const totalExpenses = expenses.reduce((sum, t) => sum + Math.abs(t.amount), 0)
        const totalIncome = incomesRes.data.total || 0
        const balance = totalIncome - totalExpenses
        
        setFinancialData({
          transactions,
          expenses,
          totalExpenses,
          totalIncome,
          balance,
          incomesSummary: incomesRes.data,
          budget: budgetRes.data
        })
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!financialData) {
    return <div>Erro ao carregar dados</div>
  }

  const { totalIncome, totalExpenses, balance, expenses, budget, incomesSummary } = financialData

  // Dados para gráficos
  const categoryData = {}
  expenses.forEach(t => {
    categoryData[t.category] = (categoryData[t.category] || 0) + Math.abs(t.amount)
  })

  const pieData = Object.entries(categoryData).map(([name, value]) => ({ name, value }))
  // Paleta suave e delicada
  const COLORS = ['#93C5FD', '#C4B5FD', '#F9A8D4', '#86EFAC', '#FDE68A', '#FECACA', '#A5F3FC', '#FED7AA']

  // Comparativo mensal
  const comparisonData = [
    { name: 'Receitas', value: totalIncome },
    { name: 'Despesas', value: totalExpenses },
    { name: 'Saldo', value: Math.abs(balance) }
  ]

  const recentTransactions = expenses.slice(0, 5)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Financeiro</h1>
        <p className="text-gray-600 mt-1">Visão completa das suas finanças</p>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Receitas do Mês"
          value={`R$ ${totalIncome.toFixed(2)}`}
          icon={FiTrendingUp}
          color="green"
          trendValue="Total recebido"
        />
        <StatCard
          title="Despesas do Mês"
          value={`R$ ${totalExpenses.toFixed(2)}`}
          icon={FiTrendingDown}
          color="red"
          trendValue="Total gasto"
        />
        <StatCard
          title="Saldo Disponível"
          value={`R$ ${balance.toFixed(2)}`}
          icon={balance >= 0 ? FiCheckCircle : FiAlertCircle}
          color={balance >= 0 ? "green" : "red"}
          trend={balance >= 0 ? "up" : "down"}
          trendValue={balance >= 0 ? "Positivo" : "Negativo"}
        />
        <StatCard
          title="Orçamento"
          value={budget?.totals?.budgeted ? `R$ ${budget.totals.budgeted.toFixed(2)}` : "Não definido"}
          icon={FiTarget}
          color="purple"
          trendValue="Planejado"
        />
      </div>

      {/* Alerta de Orçamento */}
      {budget?.totals && budget.totals.spent > budget.totals.budgeted && (
        <Card>
          <div className="flex items-center gap-3 text-red-600">
            <FiAlertCircle size={24} />
            <div>
              <p className="font-semibold">Atenção: Orçamento Ultrapassado!</p>
              <p className="text-sm">
                Você gastou R$ {(budget.totals.spent - budget.totals.budgeted).toFixed(2)} a mais que o planejado este mês.
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Receitas vs Despesas */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Receitas vs Despesas</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={comparisonData}>
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip formatter={(value) => `R$ ${value.toFixed(2)}`} />
              <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                {comparisonData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={index === 0 ? '#86EFAC' : index === 1 ? '#FECACA' : balance >= 0 ? '#93C5FD' : '#FED7AA'} 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Gastos por Categoria */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Gastos por Categoria</h3>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `R$ ${value.toFixed(2)}`} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-500">
              <div className="text-center">
                <FiDollarSign size={48} className="mx-auto mb-2 text-gray-300" />
                <p>Nenhuma despesa registrada</p>
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* Budget Progress & Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Budget Progress */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Progresso do Orçamento</h3>
          {budget?.comparison && budget.comparison.length > 0 ? (
            <div className="space-y-4">
              {budget.comparison.slice(0, 5).map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">{item.category}</span>
                    <span className="text-sm text-gray-600">
                      R$ {item.spent.toFixed(2)} / R$ {item.budgeted.toFixed(2)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        item.percentage <= 80 ? 'bg-green-500' :
                        item.percentage <= 100 ? 'bg-yellow-500' :
                        'bg-red-500'
                      }`}
                      style={{ width: `${Math.min(item.percentage, 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <FiTarget size={48} className="mx-auto mb-2 text-gray-300" />
              <p>Nenhum orçamento definido</p>
              <p className="text-sm">Defina orçamentos para acompanhar seus gastos</p>
            </div>
          )}
        </Card>

        {/* Recent Transactions */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Transações Recentes</h3>
          {recentTransactions.length > 0 ? (
            <div className="space-y-3">
              {recentTransactions.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-100 text-red-600 rounded-lg">
                      <FiDollarSign size={18} />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{tx.description}</p>
                      <p className="text-xs text-gray-600">{tx.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900 text-sm">
                      - R$ {Math.abs(tx.amount).toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-600">
                      {new Date(tx.date).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <FiDollarSign size={48} className="mx-auto mb-2 text-gray-300" />
              <p>Nenhuma transação registrada</p>
            </div>
          )}
        </Card>
      </div>

      {/* Financial Health Summary */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumo da Saúde Financeira</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <FiTrendingUp className="text-green-600 mx-auto mb-2" size={32} />
            <p className="text-sm text-gray-600 mb-1">Taxa de Poupança</p>
            <p className="text-2xl font-bold text-green-600">
              {totalIncome > 0 ? ((balance / totalIncome) * 100).toFixed(1) : 0}%
            </p>
          </div>
          
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <FiCreditCard className="text-blue-600 mx-auto mb-2" size={32} />
            <p className="text-sm text-gray-600 mb-1">Total de Despesas</p>
            <p className="text-2xl font-bold text-blue-600">{expenses.length}</p>
          </div>
          
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <FiDollarSign className="text-purple-600 mx-auto mb-2" size={32} />
            <p className="text-sm text-gray-600 mb-1">Gasto Médio</p>
            <p className="text-2xl font-bold text-purple-600">
              R$ {expenses.length > 0 ? (totalExpenses / expenses.length).toFixed(2) : '0.00'}
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}

