import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/api'
import Button from '../components/Button'
import Input from '../components/Input'
import { FiMail, FiLock, FiUser, FiDollarSign, FiTarget, FiTrendingUp, FiPieChart } from 'react-icons/fi'

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
    <div className="min-h-screen flex">
      {/* Left Side - Branding (estilo Mobills) */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#1A1D1E] relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-20 w-64 h-64 rounded-full border-2 border-white"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 rounded-full border-2 border-white"></div>
          <div className="absolute top-1/2 left-1/3 w-48 h-48 rounded-full border-2 border-white"></div>
        </div>
        
        <div className="relative z-10 flex flex-col justify-center px-16">
          {/* Logo */}
          <div className="flex items-center gap-4 mb-12">
            <div className="p-4 bg-[#00D09C] rounded-2xl">
              <FiDollarSign className="text-white" size={40} />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white">Meu</h1>
              <p className="text-2xl text-[#00D09C] font-semibold -mt-1">Financeiro</p>
            </div>
          </div>
          
          <h2 className="text-3xl font-bold text-white mb-6">
            Controle total das suas<br />
            <span className="text-[#00D09C]">finanças pessoais</span>
          </h2>
          
          <p className="text-gray-400 text-lg mb-12 max-w-md">
            Gerencie suas receitas, despesas e metas financeiras de forma simples e inteligente.
          </p>
          
          {/* Features */}
          <div className="space-y-6">
            {[
              { icon: FiPieChart, title: 'Dashboard Completo', desc: 'Visualize todos seus gastos em tempo real' },
              { icon: FiTarget, title: 'Metas Financeiras', desc: 'Defina objetivos e acompanhe seu progresso' },
              { icon: FiTrendingUp, title: 'Análise Inteligente', desc: 'Relatórios e insights sobre suas finanças' }
            ].map((feature, i) => (
              <div key={i} className="flex gap-4 items-start">
                <div className="p-3 bg-[#2D3436] rounded-xl">
                  <feature.icon className="text-[#00D09C]" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-white text-lg">{feature.title}</h3>
                  <p className="text-gray-500">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-[#F5F6FA]">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-10">
            <div className="p-3 bg-[#00D09C] rounded-xl">
              <FiDollarSign className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#2D3436]">Meu</h1>
              <p className="text-lg text-[#00D09C] font-semibold -mt-1">Financeiro</p>
            </div>
          </div>
          
          <div className="bg-white rounded-3xl shadow-mobills-lg p-8 md:p-10">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-[#2D3436] mb-2">
                {isLogin ? 'Bem-vindo de volta!' : 'Crie sua conta'}
              </h2>
              <p className="text-gray-500">
                {isLogin ? 'Entre para continuar gerenciando suas finanças' : 'Comece a organizar suas finanças hoje'}
              </p>
            </div>
            
            {error && (
              <div className="mb-6 p-4 bg-[#FFE8E8] border border-[#FF6B6B] rounded-xl text-[#FF6B6B] text-sm font-medium">
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
                {loading ? (
                  <span className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Processando...
                  </span>
                ) : (
                  isLogin ? 'Entrar' : 'Criar conta'
                )}
              </Button>
            </form>
            
            <div className="mt-6 text-center">
              <button
                onClick={() => {
                  setIsLogin(!isLogin)
                  setError('')
                }}
                className="text-[#00D09C] hover:text-[#00B386] font-semibold transition-colors"
              >
                {isLogin ? 'Não tem conta? Criar uma agora' : 'Já tem conta? Fazer login'}
              </button>
            </div>
          </div>
          
          {isLogin && (
            <div className="mt-6 p-4 bg-white rounded-2xl shadow-mobills text-center">
              <p className="text-sm text-gray-500">
                <span className="font-semibold text-[#2D3436]">Conta de teste:</span><br />
                admin@teste.com | admin123
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
