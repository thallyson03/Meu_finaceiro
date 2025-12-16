import React, { useEffect, useState } from 'react'
import api from '../api/api'
import Card from '../components/Card'
import { PieChart, Pie, Cell, LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { FiTrendingUp, FiTrendingDown, FiDollarSign, FiCalendar, FiCheckCircle, FiAlertCircle } from 'react-icons/fi'

export default function MonthlyBalance(){
  const [data, setData] = useState(null)
  const [projection, setProjection] = useState(null)
  const [transactionData, setTransactionData] = useState(null)
  const [loading, setLoading] = useState(true)
  const token = localStorage.getItem('token')

  useEffect(()=>{
    if(!token) return
    
    Promise.all([
      api.get('/installments/monthly-balance', { headers: { Authorization: `Bearer ${token}` } }),
      api.get('/installments/future-projection', { headers: { Authorization: `Bearer ${token}` } }),
      api.get('/transactions/summary', { headers: { Authorization: `Bearer ${token}` } })
    ])
      .then(([balanceRes, projectionRes, transactionsRes]) => {
        setData(balanceRes.data)
        setProjection(projectionRes.data)
        setTransactionData(transactionsRes.data)
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
        <div className="loading-spinner"></div>
      </div>
    )
  }

  if (!data || data.months.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Balanceamento Mensal</h1>
          <p className="text-gray-600 mt-1">Receitas vs Despesas por mês</p>
        </div>
        <Card>
          <div className="text-center py-12">
            <FiCalendar size={48} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-600 mb-2">Sem dados mensais ainda</p>
            <p className="text-sm text-gray-500">Adicione transações para ver o balanceamento</p>
          </div>
        </Card>
      </div>
    )
  }

  const { months, totalIncome, totalExpense, finalBalance } = data
  
  // Dados para gráfico de pizza
  const byCategory = transactionData?.byCategory || {}
  const pieData = Object.entries(byCategory).map(([name, value]) => ({ name, value }))
  // Paleta suave e delicada
  const COLORS = ['#93C5FD', '#C4B5FD', '#F9A8D4', '#86EFAC', '#FDE68A', '#FECACA', '#A5F3FC', '#FED7AA']

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Balanceamento Mensal</h1>
        <p className="text-gray-600 mt-1">Análise de receitas e despesas ao longo do tempo</p>
      </div>

      {/* Summary Cards - 3 em linha no mobile */}
      <div className="grid grid-cols-3 gap-3 md:gap-6">
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <div className="flex flex-col items-center text-center md:flex-row md:items-center md:justify-between md:text-left">
            <div className="flex-1 min-w-0">
              <p className="text-xs md:text-sm font-medium text-green-700 mb-1 truncate">Total Receitas</p>
              <h3 className="text-base md:text-2xl font-bold text-green-900 truncate">R$ {totalIncome.toFixed(2)}</h3>
              <p className="text-xs md:text-sm text-green-600 mt-1 hidden md:block">Últimos 12 meses</p>
            </div>
            <div className="mt-2 md:mt-0 p-2 md:p-3 bg-green-200 rounded-lg">
              <FiTrendingUp className="text-green-700" size={20} />
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-rose-50 border-red-200">
          <div className="flex flex-col items-center text-center md:flex-row md:items-center md:justify-between md:text-left">
            <div className="flex-1 min-w-0">
              <p className="text-xs md:text-sm font-medium text-red-700 mb-1 truncate">Total Despesas</p>
              <h3 className="text-base md:text-2xl font-bold text-red-900 truncate">R$ {totalExpense.toFixed(2)}</h3>
              <p className="text-xs md:text-sm text-red-600 mt-1 hidden md:block">Últimos 12 meses</p>
            </div>
            <div className="mt-2 md:mt-0 p-2 md:p-3 bg-red-200 rounded-lg">
              <FiTrendingDown className="text-red-700" size={20} />
            </div>
          </div>
        </Card>

        <Card className={`bg-gradient-to-br ${finalBalance >= 0 ? 'from-blue-50 to-indigo-50 border-blue-200' : 'from-orange-50 to-red-50 border-orange-200'}`}>
          <div className="flex flex-col items-center text-center md:flex-row md:items-center md:justify-between md:text-left">
            <div className="flex-1 min-w-0">
              <p className={`text-xs md:text-sm font-medium ${finalBalance >= 0 ? 'text-blue-700' : 'text-orange-700'} mb-1 truncate`}>Balanço Final</p>
              <h3 className={`text-base md:text-2xl font-bold ${finalBalance >= 0 ? 'text-blue-900' : 'text-orange-900'} truncate`}>
                R$ {Math.abs(finalBalance).toFixed(2)}
              </h3>
              <p className={`text-xs md:text-sm ${finalBalance >= 0 ? 'text-blue-600' : 'text-orange-600'} mt-1 hidden md:block`}>
                {finalBalance >= 0 ? 'Positivo ✓' : 'Negativo ⚠'}
              </p>
            </div>
            <div className={`mt-2 md:mt-0 p-2 md:p-3 ${finalBalance >= 0 ? 'bg-blue-200' : 'bg-orange-200'} rounded-lg`}>
              {finalBalance >= 0 ? (
                <FiCheckCircle className="text-blue-700" size={20} />
              ) : (
                <FiAlertCircle className="text-orange-700" size={20} />
              )}
            </div>
          </div>
        </Card>
      </div>

      {/* Gastos por Categoria */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Gastos por Categoria</h3>
        {pieData.length > 0 ? (
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={120}
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
          <div className="h-[400px] flex items-center justify-center text-gray-500">
            <div className="text-center">
              <FiDollarSign size={48} className="mx-auto mb-3 text-gray-300" />
              <p className="font-medium">Sem despesas registradas</p>
              <p className="text-sm mt-1">Adicione transações para ver o gráfico</p>
            </div>
          </div>
        )}
      </Card>

      {/* Saldo Acumulado - Oculto em mobile */}
      <Card className="hidden md:block">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Saldo Acumulado ao Longo do Tempo</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={months}>
            <XAxis dataKey="month" axisLine={false} tickLine={false} />
            <YAxis axisLine={false} tickLine={false} />
            <Tooltip 
              formatter={(value) => `R$ ${value.toFixed(2)}`}
              contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '8px' }}
            />
            <Line 
              type="monotone" 
              dataKey="accumulated" 
              name="Saldo Acumulado" 
              stroke="#C4B5FD" 
              strokeWidth={3}
              dot={{ fill: '#C4B5FD', r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Projeção Futura de Parcelas */}
      {projection && projection.projection.length > 0 && (
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Projeção de Parcelas - Próximos 6 Meses
          </h3>
          <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>💡 Previsão:</strong> Valores que você terá que pagar mensalmente das suas compras parceladas.
            </p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={projection.projection}>
              <XAxis dataKey="month" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip 
                formatter={(value) => `R$ ${value.toFixed(2)}`}
                contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '8px' }}
              />
              <Bar dataKey="amount" name="Parcelas a Pagar" fill="#FDE68A" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-4 grid grid-cols-2 md:grid-cols-6 gap-3">
            {projection.projection.map((month, idx) => (
              <div key={idx} className="p-3 bg-gray-50 rounded-lg text-center">
                <p className="text-xs text-gray-600 mb-1">{month.month}</p>
                <p className="font-bold text-gray-900">R$ {month.amount.toFixed(2)}</p>
                <p className="text-xs text-gray-600">{month.count} parcela(s)</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Detalhamento Mensal - Oculto em mobile */}
      <Card className="hidden md:block">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Detalhamento Mensal</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mês</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Receitas</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Despesas</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Saldo</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acumulado</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {months.map((month, idx) => (
                <tr key={idx} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{month.month}</td>
                  <td className="px-4 py-3 text-sm text-right text-green-600 font-semibold">
                    + R$ {month.income.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-sm text-right text-red-600 font-semibold">
                    - R$ {month.expense.toFixed(2)}
                  </td>
                  <td className={`px-4 py-3 text-sm text-right font-bold ${month.balance >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>
                    R$ {month.balance.toFixed(2)}
                  </td>
                  <td className={`px-4 py-3 text-sm text-right font-bold ${month.accumulated >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    R$ {month.accumulated.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {month.balance >= 0 ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <FiCheckCircle className="mr-1" size={12} />
                        Positivo
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        <FiAlertCircle className="mr-1" size={12} />
                        Negativo
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Análise de Tendências</h3>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm font-medium text-blue-900 mb-2">📊 Média Mensal</p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-blue-700">Receitas</p>
                  <p className="font-bold text-blue-900">R$ {(totalIncome / months.length).toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-blue-700">Despesas</p>
                  <p className="font-bold text-blue-900">R$ {(totalExpense / months.length).toFixed(2)}</p>
                </div>
              </div>
            </div>
            
            <div className={`p-4 rounded-lg ${finalBalance >= 0 ? 'bg-green-50' : 'bg-orange-50'}`}>
              <p className="text-sm font-medium text-gray-900 mb-2">
                {finalBalance >= 0 ? '✅ Situação Financeira' : '⚠️ Situação Financeira'}
              </p>
              <p className={`text-sm ${finalBalance >= 0 ? 'text-green-700' : 'text-orange-700'}`}>
                {finalBalance >= 0 ? (
                  <>Você está economizando! Seu saldo acumulado é positivo em R$ {finalBalance.toFixed(2)}.</>
                ) : (
                  <>Atenção! Suas despesas superam suas receitas em R$ {Math.abs(finalBalance).toFixed(2)}.</>
                )}
              </p>
            </div>

            <div className="p-4 bg-purple-50 rounded-lg">
              <p className="text-sm font-medium text-purple-900 mb-2">📈 Melhor Mês</p>
              {(() => {
                const bestMonth = months.reduce((best, m) => m.balance > best.balance ? m : best, months[0]);
                return (
                  <div>
                    <p className="font-bold text-purple-900">{bestMonth.month}</p>
                    <p className="text-sm text-purple-700">Saldo: R$ {bestMonth.balance.toFixed(2)}</p>
                  </div>
                );
              })()}
            </div>

            <div className="p-4 bg-red-50 rounded-lg">
              <p className="text-sm font-medium text-red-900 mb-2">📉 Pior Mês</p>
              {(() => {
                const worstMonth = months.reduce((worst, m) => m.balance < worst.balance ? m : worst, months[0]);
                return (
                  <div>
                    <p className="font-bold text-red-900">{worstMonth.month}</p>
                    <p className="text-sm text-red-700">Saldo: R$ {worstMonth.balance.toFixed(2)}</p>
                  </div>
                );
              })()}
            </div>
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumo do Período</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">Período Analisado</span>
              <span className="font-bold text-gray-900">{months.length} meses</span>
            </div>

            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <span className="text-sm font-medium text-green-700">Meses Positivos</span>
              <span className="font-bold text-green-900">
                {months.filter(m => m.balance >= 0).length}
              </span>
            </div>

            <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
              <span className="text-sm font-medium text-red-700">Meses Negativos</span>
              <span className="font-bold text-red-900">
                {months.filter(m => m.balance < 0).length}
              </span>
            </div>

            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <span className="text-sm font-medium text-blue-700">Total Transações</span>
              <span className="font-bold text-blue-900">
                {months.reduce((sum, m) => sum + m.transactions, 0)}
              </span>
            </div>

            <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
              <span className="text-sm font-medium text-purple-700">Média Transações/Mês</span>
              <span className="font-bold text-purple-900">
                {(months.reduce((sum, m) => sum + m.transactions, 0) / months.length).toFixed(0)}
              </span>
            </div>
          </div>
        </Card>
      </div>

      {/* Comparação Mês a Mês */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Comparação Detalhada - Mês a Mês</h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={months}>
            <XAxis dataKey="month" axisLine={false} tickLine={false} />
            <YAxis axisLine={false} tickLine={false} />
            <Tooltip 
              formatter={(value) => `R$ ${value.toFixed(2)}`}
              contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '8px' }}
            />
            <Legend />
            <Bar dataKey="income" name="Receitas" fill="#86EFAC" radius={[4, 4, 0, 0]} />
            <Bar dataKey="expense" name="Despesas" fill="#FECACA" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  )
}

