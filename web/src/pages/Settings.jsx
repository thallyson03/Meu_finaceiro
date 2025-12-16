import React, { useState, useEffect } from 'react'
import api from '../api/api'
import Card from '../components/Card'
import Button from '../components/Button'
import { 
  FiUser, FiLock, FiBell, FiDownload, FiTrash2, FiMoon, FiSun,
  FiFileText, FiDatabase, FiPrinter, FiCheck, FiCalendar
} from 'react-icons/fi'

export default function Settings(){
  const [darkMode, setDarkMode] = useState(false)
  const [exportLoading, setExportLoading] = useState(false)
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1)
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const token = localStorage.getItem('token')

  useEffect(() => {
    // Carregar preferência de tema
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme === 'dark') {
      setDarkMode(true)
      document.documentElement.classList.add('dark')
    }
  }, [])

  const toggleDarkMode = () => {
    const newMode = !darkMode
    setDarkMode(newMode)
    
    if (newMode) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }

  const handleExportCSV = async () => {
    setExportLoading(true)
    try {
      const response = await api.get('/export/transactions/csv', {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob'
      })
      
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', 'transacoes.csv')
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Erro ao exportar:', error)
      alert('Erro ao exportar dados')
    }
    setExportLoading(false)
  }

  const handleExportJSON = async () => {
    setExportLoading(true)
    try {
      const response = await api.get('/export/full', {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob'
      })
      
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', 'relatorio-financeiro.json')
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Erro ao exportar:', error)
      alert('Erro ao exportar dados')
    }
    setExportLoading(false)
  }

  const handlePrintReport = async () => {
    setExportLoading(true)
    try {
      const response = await api.get(`/export/report?month=${selectedMonth}&year=${selectedYear}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      const report = response.data
      
      // Criar janela de impressão
      const printWindow = window.open('', '_blank')
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>${report.title}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; max-width: 800px; margin: 0 auto; }
            h1 { color: #1f2937; border-bottom: 2px solid #3b82f6; padding-bottom: 10px; }
            h2 { color: #374151; margin-top: 30px; }
            .summary { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin: 20px 0; }
            .summary-item { background: #f3f4f6; padding: 15px; border-radius: 8px; }
            .summary-item label { color: #6b7280; font-size: 12px; }
            .summary-item value { font-size: 24px; font-weight: bold; display: block; }
            .positive { color: #10b981; }
            .negative { color: #ef4444; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { padding: 10px; text-align: left; border-bottom: 1px solid #e5e7eb; }
            th { background: #f3f4f6; font-weight: 600; }
            .progress-bar { background: #e5e7eb; height: 8px; border-radius: 4px; overflow: hidden; }
            .progress-fill { height: 100%; background: #3b82f6; }
            @media print { body { padding: 0; } }
          </style>
        </head>
        <body>
          <h1>📊 ${report.title}</h1>
          
          <div class="summary">
            <div class="summary-item">
              <label>Total de Receitas</label>
              <value class="positive">R$ ${report.summary.totalIncome.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</value>
            </div>
            <div class="summary-item">
              <label>Total de Despesas</label>
              <value class="negative">R$ ${report.summary.totalExpense.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</value>
            </div>
            <div class="summary-item">
              <label>Saldo do Mês</label>
              <value class="${report.summary.balance >= 0 ? 'positive' : 'negative'}">
                R$ ${report.summary.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </value>
            </div>
            <div class="summary-item">
              <label>Total de Transações</label>
              <value>${report.summary.transactionCount}</value>
            </div>
          </div>

          <h2>📈 Gastos por Categoria</h2>
          <table>
            <thead>
              <tr>
                <th>Categoria</th>
                <th>Valor Gasto</th>
              </tr>
            </thead>
            <tbody>
              ${Object.entries(report.expensesByCategory).map(([cat, val]) => `
                <tr>
                  <td>${cat}</td>
                  <td class="negative">R$ ${val.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          ${report.budgetComparison.length > 0 ? `
            <h2>🎯 Orçamento vs Realizado</h2>
            <table>
              <thead>
                <tr>
                  <th>Categoria</th>
                  <th>Limite</th>
                  <th>Gasto</th>
                  <th>%</th>
                </tr>
              </thead>
              <tbody>
                ${report.budgetComparison.map(b => `
                  <tr>
                    <td>${b.category}</td>
                    <td>R$ ${b.limit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                    <td class="${b.spent > b.limit ? 'negative' : ''}">R$ ${b.spent.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                    <td>${b.percentage.toFixed(0)}%</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          ` : ''}

          ${report.goals.length > 0 ? `
            <h2>🎯 Metas Financeiras</h2>
            <table>
              <thead>
                <tr>
                  <th>Meta</th>
                  <th>Progresso</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                ${report.goals.map(g => `
                  <tr>
                    <td>${g.name}</td>
                    <td>R$ ${g.currentAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} / R$ ${g.targetAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                    <td>${g.isCompleted ? '✅ Concluída' : `${g.progress.toFixed(0)}%`}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          ` : ''}

          <h2>📋 Transações do Mês</h2>
          <table>
            <thead>
              <tr>
                <th>Data</th>
                <th>Descrição</th>
                <th>Categoria</th>
                <th>Valor</th>
              </tr>
            </thead>
            <tbody>
              ${report.transactions.map(t => `
                <tr>
                  <td>${t.date}</td>
                  <td>${t.description}</td>
                  <td>${t.category}</td>
                  <td class="${t.type === 'income' ? 'positive' : 'negative'}">
                    ${t.type === 'income' ? '+' : '-'}R$ ${Math.abs(t.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div style="margin-top: 40px; text-align: center; color: #9ca3af; font-size: 12px;">
            <p>Relatório gerado em ${new Date().toLocaleString('pt-BR')}</p>
            <p>Meu Planejamento Financeiro</p>
          </div>
        </body>
        </html>
      `)
      printWindow.document.close()
      printWindow.print()
    } catch (error) {
      console.error('Erro ao gerar relatório:', error)
      alert('Erro ao gerar relatório')
    }
    setExportLoading(false)
  }

  const months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ]

  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">⚙️ Configurações</h1>
        <p className="text-gray-600 mt-1">Gerencie suas preferências e dados</p>
      </div>

      {/* Aparência */}
      <Card>
        <div className="flex items-center gap-4 mb-6">
          <div className="p-4 bg-purple-100 rounded-full">
            {darkMode ? <FiMoon className="text-purple-600" size={24} /> : <FiSun className="text-purple-600" size={24} />}
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Aparência</h2>
            <p className="text-gray-600">Personalize a interface</p>
          </div>
        </div>
        
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
          <div>
            <p className="font-medium text-gray-900">Modo Escuro</p>
            <p className="text-sm text-gray-600">Reduz o cansaço visual em ambientes escuros</p>
          </div>
          <button
            onClick={toggleDarkMode}
            className={`relative w-14 h-7 rounded-full transition-colors ${
              darkMode ? 'bg-purple-600' : 'bg-gray-300'
            }`}
          >
            <div className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow-md transition-transform flex items-center justify-center ${
              darkMode ? 'translate-x-7' : ''
            }`}>
              {darkMode ? <FiMoon size={14} className="text-purple-600" /> : <FiSun size={14} className="text-yellow-500" />}
            </div>
          </button>
        </div>
      </Card>

      {/* Exportação de Dados */}
      <Card>
        <div className="flex items-center gap-4 mb-6">
          <div className="p-4 bg-green-100 rounded-full">
            <FiDownload className="text-green-600" size={24} />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Exportar Dados</h2>
            <p className="text-gray-600">Baixe suas informações financeiras</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={handleExportCSV}
            disabled={exportLoading}
            className="p-4 border-2 border-gray-200 rounded-xl hover:border-green-500 hover:bg-green-50 transition-all text-left disabled:opacity-50"
          >
            <FiFileText className="text-green-600 mb-2" size={24} />
            <p className="font-semibold text-gray-900">Exportar CSV</p>
            <p className="text-sm text-gray-600">Transações em planilha</p>
          </button>
          
          <button
            onClick={handleExportJSON}
            disabled={exportLoading}
            className="p-4 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all text-left disabled:opacity-50"
          >
            <FiDatabase className="text-blue-600 mb-2" size={24} />
            <p className="font-semibold text-gray-900">Backup Completo</p>
            <p className="text-sm text-gray-600">Todos os dados em JSON</p>
          </button>
          
          <div className="p-4 border-2 border-gray-200 rounded-xl">
            <FiPrinter className="text-purple-600 mb-2" size={24} />
            <p className="font-semibold text-gray-900 mb-2">Imprimir Relatório</p>
            <div className="flex gap-2 mb-2">
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded-lg"
              >
                {months.map((m, idx) => (
                  <option key={idx} value={idx + 1}>{m}</option>
                ))}
              </select>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                className="px-2 py-1 text-sm border border-gray-300 rounded-lg"
              >
                {years.map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
            <button
              onClick={handlePrintReport}
              disabled={exportLoading}
              className="w-full py-2 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
            >
              {exportLoading ? 'Gerando...' : 'Gerar Relatório'}
            </button>
          </div>
        </div>
      </Card>

      {/* Perfil do Usuário */}
      <Card>
        <div className="flex items-center gap-4 mb-6">
          <div className="p-4 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full">
            <FiUser className="text-white" size={24} />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Perfil do Usuário</h2>
            <p className="text-gray-600">Informações da sua conta</p>
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
            <input
              type="text"
              placeholder="Seu nome"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
            <input
              type="email"
              placeholder="seu@email.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled
            />
          </div>
        </div>
        
        <div className="mt-6">
          <Button variant="outline" disabled>
            <FiUser size={18} />
            Editar Perfil (Em breve)
          </Button>
        </div>
      </Card>

      {/* Segurança */}
      <Card>
        <div className="flex items-center gap-4 mb-6">
          <div className="p-4 bg-red-100 rounded-full">
            <FiLock className="text-red-600" size={24} />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Segurança</h2>
            <p className="text-gray-600">Proteja sua conta</p>
          </div>
        </div>
        
        <div className="space-y-3">
          <Button variant="outline" disabled>
            <FiLock size={18} />
            Alterar Senha (Em breve)
          </Button>
        </div>
      </Card>

      {/* Notificações */}
      <Card>
        <div className="flex items-center gap-4 mb-6">
          <div className="p-4 bg-yellow-100 rounded-full">
            <FiBell className="text-yellow-600" size={24} />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Notificações</h2>
            <p className="text-gray-600">Configure suas preferências</p>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div>
              <p className="font-medium text-gray-900">Alertas de Gastos</p>
              <p className="text-sm text-gray-600">Receba avisos quando ultrapassar limites</p>
            </div>
            <div className="flex items-center gap-2 text-green-600 text-sm">
              <FiCheck /> Ativo no sistema
            </div>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div>
              <p className="font-medium text-gray-900">Relatórios Mensais por E-mail</p>
              <p className="text-sm text-gray-600">Resumo das suas finanças</p>
            </div>
            <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded">Em breve</span>
          </div>
        </div>
      </Card>

      {/* Zona de Perigo */}
      <Card className="border-red-200">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-4 bg-red-100 rounded-full">
            <FiTrash2 className="text-red-600" size={24} />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Zona de Perigo</h2>
            <p className="text-gray-600">Ações irreversíveis</p>
          </div>
        </div>
        
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
          <p className="text-sm text-red-700 mb-3">
            ⚠️ Excluir sua conta removerá permanentemente todos os seus dados, incluindo transações, metas e orçamentos.
          </p>
          <Button variant="danger" disabled>
            <FiTrash2 size={18} />
            Excluir Conta (Em breve)
          </Button>
        </div>
      </Card>
      
      <div className="text-center text-sm text-gray-600 pb-4">
        <p>Versão 2.0.0 - Com novas funcionalidades!</p>
        <p className="text-xs mt-1">🎯 Metas • 🔄 Recorrentes • 🏦 Contas • 📤 Exportação</p>
      </div>
    </div>
  )
}
