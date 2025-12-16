import React from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Transactions from './pages/Transactions'
import Incomes from './pages/Incomes'
import Budget from './pages/Budget'
import Installments from './pages/Installments'
import MonthlyBalance from './pages/MonthlyBalance'
import Goals from './pages/Goals'
import Recurring from './pages/Recurring'
import Accounts from './pages/Accounts'
import Settings from './pages/Settings'
import Login from './pages/Login'
import Sidebar from './components/Sidebar'

// Componente de rota protegida
function PrivateRoute({ children }) {
  const token = localStorage.getItem('token')
  return token ? children : <Navigate to="/login" replace />
}

// Componente de rota pública (redireciona se já estiver logado)
function PublicRoute({ children }) {
  const token = localStorage.getItem('token')
  return token ? <Navigate to="/dashboard" replace /> : children
}

export default function App(){
  const location = useLocation()
  const isLoginPage = location.pathname === '/login'
  
  return (
    <div className="min-h-screen flex bg-[#F5F6FA]">
      {!isLoginPage && <Sidebar />}
      <main className={`flex-1 ${isLoginPage ? '' : 'p-4 sm:p-6 lg:p-8 pt-20 lg:pt-6 overflow-auto'}`}>
        <Routes>
          <Route path="/login" element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } />
          
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          
          <Route path="/dashboard" element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } />
          
          <Route path="/transactions" element={
            <PrivateRoute>
              <Transactions />
            </PrivateRoute>
          } />
          
          <Route path="/incomes" element={
            <PrivateRoute>
              <Incomes />
            </PrivateRoute>
          } />
          
          <Route path="/budget" element={
            <PrivateRoute>
              <Budget />
            </PrivateRoute>
          } />
          
          <Route path="/installments" element={
            <PrivateRoute>
              <Installments />
            </PrivateRoute>
          } />
          
          <Route path="/balance" element={
            <PrivateRoute>
              <MonthlyBalance />
            </PrivateRoute>
          } />
          
          <Route path="/goals" element={
            <PrivateRoute>
              <Goals />
            </PrivateRoute>
          } />
          
          <Route path="/recurring" element={
            <PrivateRoute>
              <Recurring />
            </PrivateRoute>
          } />
          
          <Route path="/accounts" element={
            <PrivateRoute>
              <Accounts />
            </PrivateRoute>
          } />
          
          <Route path="/settings" element={
            <PrivateRoute>
              <Settings />
            </PrivateRoute>
          } />
        </Routes>
      </main>
    </div>
  )
}
