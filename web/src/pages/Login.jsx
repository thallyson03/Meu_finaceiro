import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/api'
import Button from '../components/Button'
import Input from '../components/Input'
import { FiMail, FiLock, FiUser, FiTrendingUp } from 'react-icons/fi'

export default function Login() {
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  })
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    
    try {
      if (isLogin) {
        const response = await api.post('/auth/login', {
          email: formData.email,
          password: formData.password
        })
        localStorage.setItem('token', response.data.token)
        navigate('/dashboard')
      } else {
        await api.post('/auth/register', formData)
        const response = await api.post('/auth/login', {
          email: formData.email,
          password: formData.password
        })
        localStorage.setItem('token', response.data.token)
        navigate('/dashboard')
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao processar. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-6xl w-full grid md:grid-cols-2 gap-8 items-center">
        {/* Left Side - Info */}
        <div className="hidden md:block">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-600 rounded-xl">
                <FiTrendingUp className="text-white" size={32} />
              </div>
              <h1 className="text-4xl font-bold text-gray-900">
                Meu Planejamento<br />
                <span className="text-blue-600">Financeiro</span>
              </h1>
            </div>
            
            <p className="text-lg text-gray-600">
              Gerencie suas finanças de forma inteligente e tome decisões melhores sobre seu dinheiro.
            </p>
            
            <div className="space-y-4">
              {[
                { icon: '📊', title: 'Visualize seus gastos', desc: 'Gráficos interativos e relatórios detalhados' },
                { icon: '🎯', title: 'Defina metas', desc: 'Estabeleça objetivos financeiros e acompanhe' },
                { icon: '🤖', title: 'OCR Inteligente', desc: 'Extraia dados de faturas automaticamente' }
              ].map((feature, i) => (
                <div key={i} className="flex gap-4 items-start">
                  <span className="text-3xl">{feature.icon}</span>
                  <div>
                    <h3 className="font-semibold text-gray-900">{feature.title}</h3>
                    <p className="text-sm text-gray-600">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Right Side - Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {isLogin ? 'Bem-vindo de volta!' : 'Crie sua conta'}
            </h2>
            <p className="text-gray-600">
              {isLogin ? 'Entre para continuar' : 'Comece a organizar suas finanças'}
            </p>
          </div>
          
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <Input
                label="Nome completo"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="Seu nome"
                icon={FiUser}
                required
              />
            )}
            
            <Input
              label="E-mail"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              placeholder="seu@email.com"
              icon={FiMail}
              required
            />
            
            <Input
              label="Senha"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              placeholder="••••••••"
              icon={FiLock}
              required
            />
            
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              disabled={loading}
            >
              {loading ? 'Processando...' : (isLogin ? 'Entrar' : 'Criar conta')}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsLogin(!isLogin)
                setError('')
              }}
              className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              {isLogin ? 'Não tem conta? Criar uma agora' : 'Já tem conta? Fazer login'}
            </button>
          </div>
          
          {isLogin && (
            <div className="mt-8 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600 text-center">
                <strong>Teste o sistema:</strong><br />
                Email: teste@email.com | Senha: senha123
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}


