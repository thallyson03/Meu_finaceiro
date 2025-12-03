# 🚀 GUIA RÁPIDO - Testar Novas Funcionalidades

## ✅ STATUS:
- ✅ Backend rodando em http://localhost:4000
- ✅ Frontend rodando em http://localhost:5173
- ✅ Novas rotas carregadas
- ✅ Novas páginas criadas

---

## 📋 PASSO A PASSO PARA TESTAR:

### **1️⃣ Acessar o Sistema**
```
URL: http://localhost:5173/
Login: admin@teste.com
Senha: admin123
```

---

### **2️⃣ Criar Transações com Parcelas**

1. **No Menu:** Clique em **"Transações"**
2. **Adicione uma compra parcelada:**

```
📝 Exemplo 1 - Notebook:
- Descrição: Notebook Dell
- Valor: -3000
- Categoria: Eletrônicos
- Cartão: Nubank
- Parcelas: 10
- Data: 01/11/2024
```

```
📝 Exemplo 2 - Sofá:
- Descrição: Sofá 3 Lugares
- Valor: -2400
- Categoria: Casa
- Cartão: Inter
- Parcelas: 12
- Data: 15/10/2024
```

```
📝 Exemplo 3 - Smartphone:
- Descrição: iPhone 15
- Valor: -4500
- Categoria: Eletrônicos
- Cartão: Nubank
- Parcelas: 15
- Data: 01/09/2024
```

3. **Clique em Salvar** para cada uma

---

### **3️⃣ Ver Gestão de Parcelas**

1. **No Menu:** Clique em **"Parcelas"** (ícone de cartão 💳)
2. **Você verá:**
   - ✅ Resumo geral (total, pago, a pagar)
   - ✅ Lista de todas as compras
   - ✅ Barra de progresso de cada compra
   - ✅ Próximas 3 parcelas a vencer
   - ✅ Status de quitação

**Exemplo do que você verá:**
```
📊 Compras Parceladas: 3
💰 Valor Total: R$ 9.900,00
✓ Já Pago: R$ 2.800,00 (aprox)
⏰ A Pagar: R$ 7.100,00 (aprox)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📱 iPhone 15
Cartão: Nubank | Início: 01/09/2024
R$ 4.500,00 - 15x de R$ 300,00

Progresso: ████████░░░░░░░░ 4/15 parcelas (27%)
✓ Pago: R$ 1.200,00 | Restante: R$ 3.300,00

Próximas Parcelas:
[5/15] R$ 300,00 - Vence: 01/01/2025
[6/15] R$ 300,00 - Vence: 01/02/2025
[7/15] R$ 300,00 - Vence: 01/03/2025
```

---

### **4️⃣ Adicionar Receitas e Despesas Mensais**

Para ver o **Balanceamento Mensal**, você precisa de dados em vários meses.

**Vá em "Receitas":**
```
Nov/2024: Salário - R$ 5.000,00
Out/2024: Salário - R$ 5.000,00
Set/2024: Salário - R$ 5.000,00
Ago/2024: Salário - R$ 5.000,00
```

**Vá em "Transações" (Despesas):**
```
Nov/2024: Aluguel - R$ -1.200,00
Nov/2024: Alimentação - R$ -800,00
Out/2024: Aluguel - R$ -1.200,00
Out/2024: Alimentação - R$ -900,00
Set/2024: Aluguel - R$ -1.200,00
Set/2024: Alimentação - R$ -700,00
```

---

### **5️⃣ Ver Balanceamento Mensal**

1. **No Menu:** Clique em **"Balanceamento"** (ícone de gráfico 📊)
2. **Você verá:**

**Cards de Resumo:**
```
📈 Total Receitas (12 meses): R$ 20.000,00
📉 Total Despesas (12 meses): R$ 15.800,00
💰 Balanço Final: R$ 4.200,00 ✓ Positivo
```

**Gráficos:**
- 📊 **Evolução Mensal:** Linha mostrando receitas vs despesas
- 📈 **Saldo Acumulado:** Como seu dinheiro cresceu mês a mês
- 💳 **Projeção de Parcelas:** Quanto você pagará nos próximos 6 meses
- 📊 **Comparação:** Barras lado a lado

**Tabela Detalhada:**
```
Mês      | Receitas    | Despesas    | Saldo      | Acumulado  | Status
---------|-------------|-------------|------------|------------|----------
nov/2024 | +R$ 5.000   | -R$ 2.000   | R$ 3.000   | R$ 4.200   | ✓ Positivo
out/2024 | +R$ 5.000   | -R$ 2.100   | R$ 2.900   | R$ 1.200   | ✓ Positivo
set/2024 | +R$ 5.000   | -R$ 1.900   | R$ 3.100   | -R$ 1.700  | ✓ Positivo
```

**Insights:**
```
📊 Média Mensal:
   Receitas: R$ 5.000,00
   Despesas: R$ 3.950,00

✅ Situação Financeira:
   Você está economizando! Saldo acumulado positivo em R$ 4.200,00

📈 Melhor Mês: nov/2024 - Saldo: R$ 3.000,00
📉 Pior Mês: out/2024 - Saldo: R$ 2.900,00

📅 Período: 4 meses
✓ Meses Positivos: 4
✗ Meses Negativos: 0
```

---

## 🎯 RECURSOS PRINCIPAIS:

### **Página de Parcelas:**
1. ✅ Resumo visual de todas as compras
2. ✅ Barra de progresso animada
3. ✅ Próximas parcelas destacadas
4. ✅ Cálculo automático de valores
5. ✅ Status de quitação

### **Página de Balanceamento:**
1. ✅ 4 gráficos diferentes
2. ✅ Análise de tendências
3. ✅ Melhor/pior mês
4. ✅ Projeção futura de parcelas
5. ✅ Tabela detalhada
6. ✅ Insights automáticos

---

## 🔥 DICAS PARA TESTAR MELHOR:

### **1. Adicione Dados Variados:**
```
✓ Compras parceladas em datas diferentes
✓ Receitas mensais regulares
✓ Despesas em várias categorias
✓ Cartões diferentes
```

### **2. Explore os Gráficos:**
```
✓ Passe o mouse sobre os gráficos (tooltip interativo)
✓ Veja os valores exatos
✓ Compare meses diferentes
```

### **3. Teste a Responsividade:**
```
✓ Redimensione a janela do navegador
✓ Veja como o layout se adapta
```

---

## 📱 TELAS DISPONÍVEIS:

```
🏠 Dashboard
   └─ Visão geral rápida

💰 Transações
   └─ Adicionar receitas/despesas (com ou sem parcelas)

📈 Receitas
   └─ Gerenciar ganhos mensais

🎯 Orçamento
   └─ Definir limites por categoria

💳 Parcelas ⭐ NOVO!
   └─ Ver todas as compras parceladas
   └─ Acompanhar progresso
   └─ Próximas parcelas

📊 Balanceamento ⭐ NOVO!
   └─ Análise mensal completa
   └─ Gráficos de evolução
   └─ Projeção futura
   └─ Insights automáticos
```

---

## 🚀 COMANDOS ÚTEIS:

### **Reiniciar Backend:**
```powershell
# Se precisar reiniciar manualmente
cd C:\Users\PICHAU\Downloads\meu-planejamento-financeiro-completo\backend
npm run dev
```

### **Reiniciar Frontend:**
```powershell
# Se precisar reiniciar manualmente
cd C:\Users\PICHAU\Downloads\meu-planejamento-financeiro-completo\web
npm run dev
```

### **Ver Logs:**
```powershell
# Os terminais já mostram os logs em tempo real
# Terminal 1: Backend logs
# Terminal 2: Frontend logs
```

---

## 🎊 PRONTO!

**Seu sistema está 100% funcional com as novas features!**

1. ✅ Acesse: http://localhost:5173/
2. ✅ Login: admin@teste.com / admin123
3. ✅ Explore: Menu → Parcelas / Balanceamento

---

## 📊 ENDPOINTS DA API:

```
GET /api/installments
    → Lista todas as compras parceladas

GET /api/installments/monthly-balance
    → Retorna balanceamento mensal (12 meses)

GET /api/installments/future-projection
    → Retorna projeção de parcelas (6 meses futuros)
```

**Exemplo de chamada:**
```javascript
// Headers necessários
Authorization: Bearer {seu_token_jwt}
```

---

## 🆘 PROBLEMAS COMUNS:

### **"Nenhuma compra parcelada"**
✅ Solução: Crie transações com o campo "Parcelas" preenchido

### **"Sem dados mensais"**
✅ Solução: Adicione transações em meses diferentes

### **Backend não responde**
✅ Solução: Verifique se está rodando na porta 4000

### **Frontend com erro 404**
✅ Solução: Verifique se o backend está online

---

**🎉 Aproveite as novas funcionalidades!** 💼✨

**Quer mais alguma funcionalidade? É só pedir!** 🚀


