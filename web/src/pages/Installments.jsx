import React, { useEffect, useState } from 'react'
import api from '../api/api'
import Card from '../components/Card'
import { FiCreditCard, FiCalendar, FiDollarSign, FiCheckCircle, FiClock, FiTrendingUp, FiAlertCircle } from 'react-icons/fi'

export default function Installments(){
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const token = localStorage.getItem('token')

  useEffect(()=>{
    if(!token) return
    api.get('/installments', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => {
        setData(r.data)
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

  if (!data || data.installments.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Parcelas</h1>
          <p className="text-gray-600 mt-1">Gerencie suas compras parceladas</p>
        </div>
        <Card>
          <div className="text-center py-12">
            <FiCreditCard size={48} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-600 mb-2">Nenhuma compra parcelada</p>
            <p className="text-sm text-gray-500">Ao criar transações com parcelas, elas aparecerão aqui</p>
          </div>
        </Card>
      </div>
    )
  }

  const { installments, summary } = data

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Gestão de Parcelas</h1>
        <p className="text-gray-600 mt-1 text-sm sm:text-base">Acompanhe suas compras parceladas</p>
      </div>

      {/* Summary Cards - 2x2 no mobile, 4 colunas no desktop */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div className="order-2 sm:order-1">
              <p className="text-xs sm:text-sm font-medium text-blue-700 mb-1">Compras</p>
              <h3 className="text-xl sm:text-2xl font-bold text-blue-900">{summary.total}</h3>
              <p className="text-xs sm:text-sm text-blue-600">{summary.activeInstallments} ativas</p>
            </div>
            <div className="p-2 sm:p-3 bg-blue-200 rounded-lg w-fit order-1 sm:order-2">
              <FiCreditCard className="text-blue-700" size={20} />
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div className="order-2 sm:order-1">
              <p className="text-xs sm:text-sm font-medium text-purple-700 mb-1">Valor Total</p>
              <h3 className="text-lg sm:text-2xl font-bold text-purple-900 break-all">R$ {summary.totalAmount.toFixed(2)}</h3>
              <p className="text-xs sm:text-sm text-purple-600">Todas as compras</p>
            </div>
            <div className="p-2 sm:p-3 bg-purple-200 rounded-lg w-fit order-1 sm:order-2">
              <FiDollarSign className="text-purple-700" size={20} />
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div className="order-2 sm:order-1">
              <p className="text-xs sm:text-sm font-medium text-green-700 mb-1">Já Pago</p>
              <h3 className="text-lg sm:text-2xl font-bold text-green-900 break-all">R$ {summary.paidAmount.toFixed(2)}</h3>
              <p className="text-xs sm:text-sm text-green-600">Quitadas</p>
            </div>
            <div className="p-2 sm:p-3 bg-green-200 rounded-lg w-fit order-1 sm:order-2">
              <FiCheckCircle className="text-green-700" size={20} />
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div className="order-2 sm:order-1">
              <p className="text-xs sm:text-sm font-medium text-orange-700 mb-1">A Pagar</p>
              <h3 className="text-lg sm:text-2xl font-bold text-orange-900 break-all">R$ {summary.remainingAmount.toFixed(2)}</h3>
              <p className="text-xs sm:text-sm text-orange-600">Restantes</p>
            </div>
            <div className="p-2 sm:p-3 bg-orange-200 rounded-lg w-fit order-1 sm:order-2">
              <FiClock className="text-orange-700" size={20} />
            </div>
          </div>
        </Card>
      </div>

      {/* Installments List */}
      <div className="space-y-3 sm:space-y-4">
        {installments.map(item => (
          <Card key={item.id} hover>
            <div className="space-y-3 sm:space-y-4">
              {/* Header - Stack no mobile */}
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">{item.description}</h3>
                    {item.remainingInstallments === 0 ? (
                      <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full whitespace-nowrap">
                        ✓ Quitado
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded-full whitespace-nowrap">
                        Em andamento
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <FiCreditCard size={14} />
                      <span className="truncate max-w-[100px] sm:max-w-none">{item.card || 'Não especificado'}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <FiCalendar size={14} />
                      {new Date(item.startDate).toLocaleDateString('pt-BR')}
                    </span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                      {item.category}
                    </span>
                  </div>
                </div>
                <div className="text-left sm:text-right bg-gray-50 sm:bg-transparent p-2 sm:p-0 rounded-lg">
                  <p className="text-xl sm:text-2xl font-bold text-gray-900">R$ {item.totalAmount.toFixed(2)}</p>
                  <p className="text-xs sm:text-sm text-gray-600">{item.totalInstallments}x de R$ {item.installmentValue.toFixed(2)}</p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-gray-700 font-medium">
                    {item.paidInstallments}/{item.totalInstallments} pagas
                  </span>
                  <span className="text-gray-600">
                    {item.progressPercentage.toFixed(0)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 sm:h-3">
                  <div
                    className="h-2 sm:h-3 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500"
                    style={{ width: `${item.progressPercentage}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-green-600 font-medium">
                    ✓ R$ {item.paidAmount.toFixed(2)}
                  </span>
                  <span className="text-orange-600 font-medium">
                    Resta: R$ {item.remainingAmount.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Next Installments */}
              {item.nextInstallments.length > 0 && (
                <div className="pt-3 sm:pt-4 border-t border-gray-200">
                  <p className="text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-3">Próximas:</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
                    {item.nextInstallments.map(next => (
                      <div key={next.number} className="p-2 sm:p-3 bg-blue-50 rounded-lg border border-blue-100">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium text-blue-700">
                            {next.number}/{item.totalInstallments}
                          </span>
                          <span className="text-sm font-bold text-blue-900">
                            R$ {next.value.toFixed(2)}
                          </span>
                        </div>
                        <p className="text-xs text-blue-600">
                          {new Date(next.dueDate).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Total Summary */}
      <Card className="bg-gradient-to-r from-gray-50 to-blue-50 border-blue-200">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="p-3 sm:p-4 bg-blue-100 rounded-xl">
              <FiTrendingUp className="text-blue-600" size={24} />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-700">Compromisso Total</p>
              <h3 className="text-xl sm:text-3xl font-bold text-gray-900">R$ {summary.totalAmount.toFixed(2)}</h3>
            </div>
          </div>
          <div className="w-full sm:w-auto">
            <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-8">
              <div className="text-left sm:text-right">
                <p className="text-xs sm:text-sm text-gray-600">Pago</p>
                <p className="text-lg sm:text-xl font-bold text-green-600">R$ {summary.paidAmount.toFixed(2)}</p>
              </div>
              <div className="text-right">
                <p className="text-xs sm:text-sm text-gray-600">A Pagar</p>
                <p className="text-lg sm:text-xl font-bold text-orange-600">R$ {summary.remainingAmount.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}






