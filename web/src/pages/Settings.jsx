import React from 'react'
import Card from '../components/Card'
import Button from '../components/Button'
import { FiUser, FiLock, FiMail, FiBell, FiDownload, FiTrash2 } from 'react-icons/fi'

export default function Settings(){
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Configurações</h1>
        <p className="text-gray-600 mt-1">Gerencie suas preferências e dados</p>
      </div>

      {/* User Profile */}
      <Card>
        <div className="flex items-center gap-4 mb-6">
          <div className="p-4 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full">
            <FiUser className="text-white" size={32} />
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

      {/* Security */}
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

      {/* Notifications */}
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
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Alertas de Gastos</p>
              <p className="text-sm text-gray-600">Receba avisos quando ultrapassar limites</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" disabled />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Relatórios Mensais</p>
              <p className="text-sm text-gray-600">Resumo das suas finanças por e-mail</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" disabled />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </Card>

      {/* Data Management */}
      <Card>
        <div className="flex items-center gap-4 mb-6">
          <div className="p-4 bg-green-100 rounded-full">
            <FiDownload className="text-green-600" size={24} />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Dados</h2>
            <p className="text-gray-600">Exporte ou remova seus dados</p>
          </div>
        </div>
        
        <div className="space-y-3">
          <Button variant="outline" disabled>
            <FiDownload size={18} />
            Exportar Dados (Em breve)
          </Button>
          <Button variant="danger" disabled>
            <FiTrash2 size={18} />
            Excluir Conta (Em breve)
          </Button>
        </div>
      </Card>
      
      <div className="text-center text-sm text-gray-600">
        <p>Versão 0.1.0 - Em Desenvolvimento</p>
      </div>
    </div>
  )
}
