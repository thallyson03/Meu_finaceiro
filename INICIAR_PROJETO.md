# 🚀 Como Iniciar o Projeto

## ✅ **SITUAÇÃO ATUAL - TUDO PRONTO!**

O sistema está **100% configurado e funcionando!** Só precisa iniciar os servidores.

---

## **▶️ COMANDOS PARA INICIAR (USE ESTES):**

### **Terminal 1 - Backend** 🔧
Abra um PowerShell e execute:
```powershell
cd C:\Users\PICHAU\Downloads\meu-planejamento-financeiro-completo\backend
npm run dev
```

✅ Deve aparecer: `Backend running on http://localhost:4000`

---

### **Terminal 2 - Frontend** 🎨
Abra **OUTRO** PowerShell e execute:
```powershell
cd C:\Users\PICHAU\Downloads\meu-planejamento-financeiro-completo\web
npm run dev
```

✅ Deve aparecer: `Local: http://localhost:5173/`

---

## **🌐 ACESSAR O SISTEMA:**

1. **Abra o navegador**
2. **Acesse:** http://localhost:5173/
3. **Faça Login:**
   ```
   Email: admin@teste.com
   Senha: admin123
   ```

---

## **⚠️ SE DER ERRO "EADDRINUSE" (Porta em Uso):**

### **Solução Rápida:**
```powershell
# Matar todos os processos Node
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force

# Depois iniciar novamente (Terminal 1 e 2)
```

### **Solução Específica:**
```powershell
# 1. Ver qual processo está na porta 4000
netstat -ano | findstr :4000

# 2. Anotar o PID (última coluna)
# 3. Matar o processo (substitua XXXX pelo PID)
taskkill /PID XXXX /F

# 4. Iniciar backend novamente
npm run dev
```

---

## **📦 ESTRUTURA DOS SERVIDORES:**

```
┌─────────────────────────────────────────┐
│  Terminal 1 - Backend                   │
│  cd backend && npm run dev              │
│  🔧 http://localhost:4000               │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  Terminal 2 - Frontend                  │
│  cd web && npm run dev                  │
│  🎨 http://localhost:5173               │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  Serviço - PostgreSQL                   │
│  Rodando automaticamente no Windows     │
│  🗄️ localhost:5432                      │
└─────────────────────────────────────────┘
```

---

## **🔍 VERIFICAR SE ESTÁ FUNCIONANDO:**

### **1. Verificar Backend:**
Abra: http://localhost:4000
- ✅ Se aparecer algo (mesmo que erro), está rodando!

### **2. Verificar Frontend:**
Abra: http://localhost:5173
- ✅ Deve aparecer tela de login

### **3. Verificar Banco:**
```powershell
$env:PGPASSWORD="postgres123"
& "C:\Program Files\PostgreSQL\17\bin\psql.exe" -U postgres -d meu_financeiro -c "SELECT COUNT(*) FROM \"User\";"
```
- ✅ Deve mostrar quantidade de usuários

---

## **🛑 PARA PARAR OS SERVIDORES:**

### **Método 1 - Pelo Terminal:**
No terminal onde está rodando, pressione:
```
Ctrl + C
```

### **Método 2 - Força Bruta:**
```powershell
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force
```

---

## **🔄 REINICIAR TUDO DO ZERO:**

Se algo der muito errado:

```powershell
# 1. Parar tudo
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force

# 2. Limpar cache do Prisma
cd backend
Remove-Item node_modules\.prisma -Recurse -Force -ErrorAction SilentlyContinue

# 3. Gerar Prisma
npx prisma generate

# 4. Iniciar backend
npm run dev

# 5. Em outro terminal, iniciar frontend
cd ..\web
npm run dev
```

---

## **📋 CHECKLIST DE INICIALIZAÇÃO:**

- [ ] PostgreSQL rodando (serviço Windows)
- [ ] Terminal 1: Backend iniciado (`npm run dev` em /backend)
- [ ] Terminal 2: Frontend iniciado (`npm run dev` em /web)
- [ ] Navegador aberto em http://localhost:5173
- [ ] Login com: admin@teste.com / admin123

---

## **💡 DICAS:**

### **1. Mantenha os terminais abertos**
- Não feche os terminais enquanto estiver usando
- Você verá os logs em tempo real

### **2. Hot Reload está ativo**
- Mudanças no código aparecem automaticamente
- Não precisa reiniciar os servidores

### **3. Se o Dashboard não carregar:**
- Limpe o cache do navegador (Ctrl + Shift + Delete)
- Faça hard reload (Ctrl + F5)
- Verifique o console (F12) para erros

---

## **🎯 DEPOIS DE INICIAR:**

### **1. Teste o Sistema:**
- Dashboard → Ver estatísticas
- Transações → Adicionar receitas/despesas
- Orçamento → Definir limites
- Receitas → Registrar ganhos

### **2. Adicione Dados:**
```
Exemplo de teste:
- Receita: Salário - R$ 5.000,00
- Despesa: Alimentação - R$ 500,00
- Despesa: Transporte - R$ 200,00
- Orçamento: Alimentação - Limite R$ 1.000,00
```

---

## **🆘 PROBLEMAS COMUNS:**

### **"Cannot GET /"**
✅ Normal! Backend não tem rota raiz, use as rotas de API

### **"404 Not Found"**
✅ Verifique se backend está rodando em http://localhost:4000

### **"500 Internal Server Error"**
✅ Veja o terminal do backend para ver o erro exato

### **"Connection Refused"**
✅ Backend está offline, inicie o backend primeiro

---

## **✅ TUDO CONFIGURADO!**

Seu sistema está **100% pronto**. Só precisa dos 2 comandos:

**Terminal 1:**
```powershell
cd C:\Users\PICHAU\Downloads\meu-planejamento-financeiro-completo\backend && npm run dev
```

**Terminal 2:**
```powershell
cd C:\Users\PICHAU\Downloads\meu-planejamento-financeiro-completo\web && npm run dev
```

**Acesse:** http://localhost:5173/  
**Login:** admin@teste.com / admin123

---

**🎉 Pronto para usar!** 💰✨






