import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/api'
import StatCard from '../components/StatCard'
import Card from '../components/Card'
import MonthSelector, { useMonthSelector, MONTH_NAMES } from '../components/MonthSelector'
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts'
import { FiDollarSign, FiTrendingUp, FiTrendingDown, FiTarget, FiCheckCircle, FiAlertCircle, FiCreditCard, FiCalendar, FiClock, FiBarChart2, FiArrowRight } from 'react-icons/fi'

export default function Dashboard(){
  const [financialData, setFinancialData] = useState(null)
  const [installmentsData, setInstallmentsData] = useState(null)
  const [monthlyBalance, setMonthlyBalance] = useState(null)
  const [loading, setLoading] = useState(true)
  
  // Hook para seletor de mês
  const {
    selectedMonth,
    selectedYear,
    goToPreviousMonth,
    goToNextMonth,
    goToCurrentMonth,
    isCurrentMonth,
    monthName
  } = useMonthSelector()
  
  const token = localStorage.getItem('token')
  const navigate = useNavigate()

  const loadData = () => {
    if(!token) return
    setLoading(true)
    
    Promise.all([
      api.get(`/transactions/summary?month=${selectedMonth}&year=${selectedYear}`, { headers: { Authorization: `Bearer ${token}` } }),
      api.get(`/budget/summary?month=${selectedMonth}&year=${selectedYear}`, { headers: { Authorization: `Bearer ${token}` } }),
      api.get('/installments', { headers: { Authorization: `Bearer ${token}` } }),
      api.get('/installments/monthly-balance', { headers: { Authorization: `Bearer ${token}` } }),
      api.get('/installments/future-projection', { headers: { Authorization: `Bearer ${token}` } })
    ])
      .then(([summaryRes, budgetRes, installmentsRes, balanceRes, projectionRes]) => {
        setFinancialData({
          ...summaryRes.data,
          budgetComparison: budgetRes.data.budgetComparison || []
        })
        setInstallmentsData({
          ...installmentsRes.data,
          projection: projectionRes.data.projection || []
        })
        setMonthlyBalance(balanceRes.data)
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setLoading(false)
      })
  }

  useEffect(() => {
    loadData()
  }, [selectedMonth, selectedYear])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="loading-spinner"></div>
      </div>
    )
  }

  if (!financialData) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Erro ao carregar dados</p>
      </div>
    )
  }

  const { totalIncome = 0, totalExpense = 0, balance = 0, byCategory = {}, budgetComparison = [] } = financialData
  const installmentsSummary = installmentsData?.summary || { total: 0, totalAmount: 0, paidAmount: 0, remainingAmount: 0, activeInstallments: 0 }
  const installments = installmentsData?.installments || []
  const projection = installmentsData?.projection || []
  const months = monthlyBalance?.months || []

  // Dados para gráficos
  const pieData = Object.entries(byCategory).map(([name, value]) => ({ name, value }))
  // Paleta Mobills
  const COLORS = ['#00D09C', '#FF6B6B', '#3B82F6', '#F59E0B', '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16']

  // Comparativo mensal
  const comparisonData = [
    { name: 'Receitas', value: totalIncome },
    { name: 'Despesas', value: totalExpense },
    { name: 'Saldo', value: Math.abs(balance) }
  ]

  // Próximas parcelas (próximos 30 dias)
  const upcomingInstallments = []
  const today = new Date()
  const next30Days = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000)
  
  installments.forEach(inst => {
    inst.nextInstallments?.forEach(next => {
      const dueDate = new Date(next.dueDate)
      if (dueDate >= today && dueDate <= next30Days) {
        upcomingInstallments.push({
          description: inst.description,
          value: next.value,
          dueDate: dueDate,
          installmentNumber: next.number,
          totalInstallments: inst.totalInstallments
        })
      }
    })
  })
  upcomingInstallments.sort((a, b) => a.dueDate - b.dueDate)

  return (
    <div className="space-y-6">
      {/* Header com Seletor de Mês */}
      <div className="flex flex-col gap-4">
        {/* Título */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#2D3436]">Dashboard</h1>
            <p className="text-gray-500 mt-1 text-sm sm:text-base">Visão completa das suas finanças</p>
          </div>
          
          {/* Botão Hoje - aparece apenas quando não é o mês atual */}
          {!isCurrentMonth && (
            <button
              onClick={goToCurrentMonth}
              className="px-4 py-2 text-sm font-medium text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors border border-emerald-200"
            >
              Voltar para Hoje
            </button>
          )}
        </div>
        
        {/* Seletor de Mês - Design Hero */}
        <MonthSelector
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
          onPreviousMonth={goToPreviousMonth}
          onNextMonth={goToNextMonth}
          onGoToCurrentMonth={goToCurrentMonth}
          variant="hero"
        />
      </div>

      {/* Main Stats - 6 cards em grid de 3 no mobile */}
      <div className="grid grid-cols-3 gap-2 md:gap-4 lg:grid-cols-6">
        <StatCard
          title="Receitas"
          value={`R$ ${totalIncome.toFixed(2)}`}
          icon={FiTrendingUp}
          color="green"
          trendValue={isCurrentMonth ? "Mês atual" : MONTH_NAMES[selectedMonth - 1]}
        />
        <StatCard
          title="Despesas"
          value={`R$ ${totalExpense.toFixed(2)}`}
          icon={FiTrendingDown}
          color="red"
          trendValue={isCurrentMonth ? "Mês atual" : MONTH_NAMES[selectedMonth - 1]}
        />
        <StatCard
          title="Saldo"
          value={`R$ ${balance.toFixed(2)}`}
          icon={balance >= 0 ? FiCheckCircle : FiAlertCircle}
          color={balance >= 0 ? "blue" : "orange"}
          trendValue={balance >= 0 ? "Positivo" : "Negativo"}
        />
        <StatCard
          title="Parcelado"
          value={`R$ ${installmentsSummary.remainingAmount.toFixed(2)}`}
          icon={FiCreditCard}
          color="purple"
          trendValue={`${installmentsSummary.activeInstallments} ativas`}
        />
        <StatCard
          title="Próximo Mês"
          value={`R$ ${(projection[0]?.amount || 0).toFixed(2)}`}
          icon={FiClock}
          color="orange"
          trendValue={`${projection[0]?.count || 0} parcelas`}
        />
        <StatCard
          title="Acumulado"
          value={`R$ ${(months[months.length - 1]?.accumulated || 0).toFixed(2)}`}
          icon={FiBarChart2}
          color={months[months.length - 1]?.accumulated >= 0 ? "green" : "red"}
          trendValue="Total"
        />
      </div>

      {/* Alertas Importantes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {budgetComparison.some(b => b.status === 'exceeded') && (
          <Card className="bg-red-50 border-red-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-red-600">
                <FiAlertCircle size={24} />
                <div>
                  <p className="font-semibold">Orçamento Ultrapassado!</p>
                  <p className="text-sm">
                    {budgetComparison.filter(b => b.status === 'exceeded').length} categoria(s) excederam o limite
                  </p>
                </div>
              </div>
              <button 
                onClick={() => navigate('/budget')}
                className="px-3 py-1 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition-colors flex items-center gap-1"
              >
                Ver <FiArrowRight />
              </button>
            </div>
          </Card>
        )}
        
        {upcomingInstallments.length > 0 && (
          <Card className="bg-yellow-50 border-yellow-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-yellow-700">
                <FiClock size={24} />
                <div>
                  <p className="font-semibold">{upcomingInstallments.length} parcelas vencem em 30 dias</p>
                  <p className="text-sm">
                    Total: R$ {upcomingInstallments.reduce((sum, p) => sum + p.value, 0).toFixed(2)}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => navigate('/installments')}
                className="px-3 py-1 bg-yellow-600 text-white rounded-lg text-sm hover:bg-yellow-700 transition-colors flex items-center gap-1"
              >
                Ver <FiArrowRight />
              </button>
            </div>
          </Card>
        )}

        {balance < 0 && (
          <Card className="bg-orange-50 border-orange-200">
            <div className="flex items-center gap-3 text-orange-600">
              <FiAlertCircle size={24} />
              <div>
                <p className="font-semibold">Atenção: Saldo Negativo!</p>
                <p className="text-sm">
                  Suas despesas superaram as receitas em R$ {Math.abs(balance).toFixed(2)}
                </p>
              </div>
            </div>
          </Card>
        )}

        {installmentsSummary.activeInstallments > 0 && (
          <Card className="bg-blue-50 border-blue-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-[#00D09C]">
                <FiCreditCard size={24} />
                <div>
                  <p className="font-semibold">{installmentsSummary.activeInstallments} compras parceladas ativas</p>
                  <p className="text-sm">
                    Restante: R$ {installmentsSummary.remainingAmount.toFixed(2)}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => navigate('/installments')}
                className="px-3 py-1 bg-[#00D09C] text-white rounded-lg text-sm hover:bg-[#00B386] transition-colors flex items-center gap-1"
              >
                Ver <FiArrowRight />
              </button>
            </div>
          </Card>
        )}
      </div>

      {/* Próximas Parcelas a Vencer */}
      {upcomingInstallments.length > 0 && (
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Próximas Parcelas (30 dias)</h3>
            <button 
              onClick={() => navigate('/installments')}
              className="text-[#00D09C] hover:text-[#00B386] text-sm font-medium flex items-center gap-1"
            >
              Ver todas <FiArrowRight />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {upcomingInstallments.slice(0, 6).map((installment, idx) => (
              <div key={idx} className="p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-[#00B386]">
                    {installment.installmentNumber}/{installment.totalInstallments}
                  </span>
                  <span className="text-sm font-bold text-gray-900">
                    R$ {installment.value.toFixed(2)}
                  </span>
                </div>
                <p className="text-sm font-medium text-gray-900 mb-1 truncate">{installment.description}</p>
                <p className="text-xs text-gray-600 flex items-center gap-1">
                  <FiCalendar size={12} />
                  Vence: {installment.dueDate.toLocaleDateString('pt-BR')}
                </p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Charts Row - 3 gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Receitas vs Despesas */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{MONTH_NAMES[selectedMonth - 1]} {selectedYear}</h3>
          {comparisonData.some(d => d.value > 0) ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={comparisonData} layout="vertical">
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} width={70} />
                <Tooltip formatter={(value) => `R$ ${value.toFixed(2)}`} />
                <Bar dataKey="value" radius={[0, 8, 8, 0]} barSize={35}>
                  {comparisonData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={index === 0 ? '#00D09C' : index === 1 ? '#FF6B6B' : balance >= 0 ? '#3B82F6' : '#F59E0B'} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[250px] flex items-center justify-center text-gray-500">
              <div className="text-center">
                <FiDollarSign size={36} className="mx-auto mb-2 text-gray-300" />
                <p className="text-sm">Nenhuma transação</p>
              </div>
            </div>
          )}
        </Card>

        {/* Gastos por Categoria */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Gastos por Categoria</h3>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  innerRadius={40}
                  fill="#8884d8"
                  dataKey="value"
                  paddingAngle={2}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value, name) => [`R$ ${value.toFixed(2)}`, name]}
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[250px] flex items-center justify-center text-gray-500">
              <div className="text-center">
                <FiTrendingDown size={36} className="mx-auto mb-2 text-gray-300" />
                <p className="text-sm">Sem despesas</p>
              </div>
            </div>
          )}
        </Card>

        {/* Projeção de Parcelas */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Parcelas Futuras</h3>
            <button 
              onClick={() => navigate('/balance')}
              className="text-[#00D09C] hover:text-[#00B386] text-xs font-medium"
            >
              Ver mais
            </button>
          </div>
          {projection.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={projection.slice(0, 6)} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <XAxis dataKey="month" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip 
                  formatter={(value) => [`R$ ${value.toFixed(2)}`, 'Valor']}
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
                  }}
                />
                <Bar dataKey="amount" fill="#00D09C" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[250px] flex items-center justify-center text-gray-500">
              <div className="text-center">
                <FiCreditCard size={36} className="mx-auto mb-2 text-gray-300" />
                <p className="text-sm">Sem parcelas</p>
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* Budget and Categories - Oculto no mobile */}
      <div className="hidden md:grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Budget Comparison */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Orçamento por Categoria</h3>
            <button 
              onClick={() => navigate('/budget')}
              className="text-[#00D09C] hover:text-[#00B386] text-sm font-medium flex items-center gap-1"
            >
              Gerenciar <FiArrowRight />
            </button>
          </div>
          {budgetComparison && budgetComparison.length > 0 ? (
            <div className="space-y-4">
              {budgetComparison.slice(0, 5).map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">{item.category}</span>
                    <span className="text-sm text-gray-600">
                      R$ {item.spent.toFixed(2)} / R$ {item.limit.toFixed(2)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className={`h-2.5 rounded-full transition-all ${
                        item.status === 'ok' ? 'bg-green-500' :
                        item.status === 'warning' ? 'bg-yellow-500' :
                        'bg-red-500'
                      }`}
                      style={{ width: `${Math.min(item.percentage, 100)}%` }}
                    />
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className={`font-medium ${
                      item.status === 'ok' ? 'text-green-600' :
                      item.status === 'warning' ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>
                      {item.percentage.toFixed(0)}% usado
                    </span>
                    <span className="text-gray-500">
                      Resta: R$ {(item.limit - item.spent).toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <FiTarget size={48} className="mx-auto mb-3 text-gray-300" />
              <p className="font-medium">Nenhum orçamento definido</p>
              <p className="text-sm mt-1">Defina limites para suas categorias</p>
              <button 
                onClick={() => navigate('/budget')}
                className="mt-4 px-4 py-2 bg-[#00D09C] text-white rounded-lg text-sm hover:bg-[#00B386] transition-colors"
              >
                Criar Orçamento
              </button>
            </div>
          )}
        </Card>

        {/* Expenses by Category */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Detalhamento de Gastos</h3>
            <button 
              onClick={() => navigate('/transactions')}
              className="text-[#00D09C] hover:text-[#00B386] text-sm font-medium flex items-center gap-1"
            >
              Ver todas <FiArrowRight />
            </button>
          </div>
          {Object.keys(byCategory).length > 0 ? (
            <div className="space-y-2">
              {Object.entries(byCategory)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 6)
                .map(([category, amount], idx) => {
                  const percentage = (amount / totalExpense) * 100
                  return (
                    <div key={category} className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                          />
                          <span className="font-medium text-gray-900 text-sm">{category}</span>
                        </div>
                        <p className="font-bold text-gray-900 text-sm">
                          R$ {amount.toFixed(2)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                          <div 
                            className="h-1.5 rounded-full transition-all"
                            style={{ 
                              width: `${percentage}%`,
                              backgroundColor: COLORS[idx % COLORS.length]
                            }}
                          />
                        </div>
                        <span className="text-xs text-gray-600 w-12 text-right">
                          {percentage.toFixed(0)}%
                        </span>
                      </div>
                    </div>
                  )
                })}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <FiDollarSign size={48} className="mx-auto mb-3 text-gray-300" />
              <p className="font-medium">Nenhuma despesa registrada</p>
              <p className="text-sm mt-1">Comece a rastrear seus gastos</p>
              <button 
                onClick={() => navigate('/transactions')}
                className="mt-4 px-4 py-2 bg-[#00D09C] text-white rounded-lg text-sm hover:bg-[#00B386] transition-colors"
              >
                Adicionar Transação
              </button>
            </div>
          )}
        </Card>
      </div>

      {/* Resumo Rápido - Oculto no mobile */}
      <Card className="hidden md:block bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">Total em Parcelas</p>
            <p className="text-2xl font-bold text-gray-900">
              R$ {installmentsSummary.totalAmount.toFixed(2)}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {installmentsSummary.total} compra(s)
            </p>
          </div>
          
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">Já Quitado</p>
            <p className="text-2xl font-bold text-green-600">
              R$ {installmentsSummary.paidAmount.toFixed(2)}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {installmentsSummary.total > 0 
                ? `${((installmentsSummary.paidAmount / installmentsSummary.totalAmount) * 100).toFixed(0)}%`
                : '0%'} pago
            </p>
          </div>
          
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">A Pagar</p>
            <p className="text-2xl font-bold text-orange-600">
              R$ {installmentsSummary.remainingAmount.toFixed(2)}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {installmentsSummary.activeInstallments} ativas
            </p>
          </div>
          
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">Próximo Mês</p>
            <p className="text-2xl font-bold text-purple-600">
              R$ {(projection[0]?.amount || 0).toFixed(2)}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {projection[0]?.count || 0} parcela(s)
            </p>
          </div>
        </div>
      </Card>

      {/* Quick Actions */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Ações Rápidas</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button 
            onClick={() => navigate('/transactions')}
            className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-lg hover:shadow-md transition-all text-left"
          >
            <FiTrendingUp className="text-green-600 mb-2" size={24} />
            <p className="font-semibold text-gray-900 text-sm">Adicionar Receita</p>
            <p className="text-xs text-gray-600 mt-1">Registrar ganhos</p>
          </button>
          
          <button 
            onClick={() => navigate('/transactions')}
            className="p-4 bg-gradient-to-br from-red-50 to-rose-50 border border-red-200 rounded-lg hover:shadow-md transition-all text-left"
          >
            <FiTrendingDown className="text-red-600 mb-2" size={24} />
            <p className="font-semibold text-gray-900 text-sm">Adicionar Despesa</p>
            <p className="text-xs text-gray-600 mt-1">Registrar gastos</p>
          </button>
          
          <button 
            onClick={() => navigate('/budget')}
            className="p-4 bg-gradient-to-br from-purple-50 to-violet-50 border border-purple-200 rounded-lg hover:shadow-md transition-all text-left"
          >
            <FiTarget className="text-purple-600 mb-2" size={24} />
            <p className="font-semibold text-gray-900 text-sm">Definir Orçamento</p>
            <p className="text-xs text-gray-600 mt-1">Criar limites</p>
          </button>
          
          <button 
            onClick={() => navigate('/balance')}
            className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 rounded-lg hover:shadow-md transition-all text-left"
          >
            <FiBarChart2 className="text-[#00D09C] mb-2" size={24} />
            <p className="font-semibold text-gray-900 text-sm">Ver Análises</p>
            <p className="text-xs text-gray-600 mt-1">Relatórios</p>
          </button>
        </div>
      </Card>
    </div>
  )
}
