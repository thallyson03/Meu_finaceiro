# 📱 Guia de Uso - Meu Planejamento Financeiro

## 🎨 Interface Moderna e Interativa

Sistema completo de gestão financeira pessoal com interface moderna, responsiva e interativa.

---

## 🚀 Funcionalidades Implementadas

### ✅ **Autenticação**
- **Login** com validação
- **Registro** de novos usuários
- **Proteção de rotas** (só acessa logado)
- **Logout** seguro

### 📊 **Dashboard**
- **Cards estatísticos** com ícones e cores
- **Gráfico de pizza** - Gastos por categoria
- **Gráfico de barras** - Gastos mensais
- **Transações recentes** com destaque visual
- **Breakdown de categorias** com barras de progresso
- **Animações** suaves e transições

### 💰 **Transações**
- **Listagem** completa com filtros
- **Busca** por descrição ou categoria
- **Filtro** por categoria
- **Formulário** completo para criar transações:
  - Descrição
  - Categoria (dropdown)
  - Valor
  - Data
  - Cartão (opcional)
  - Parcelas (opcional)
- **Tabela responsiva** (desktop)
- **Cards** para mobile
- **Upload de faturas** com OCR

### ⚙️ **Configurações**
- **Perfil do usuário**
- **Segurança**
- **Notificações**
- **Gerenciamento de dados**
- Interface preparada para futuras implementações

---

## 🎯 Como Usar

### **1. Primeira vez no sistema**

1. Acesse: http://localhost:5173/
2. Clique em **"Não tem conta? Criar uma agora"**
3. Preencha:
   - Nome completo
   - E-mail
   - Senha
4. Clique em **"Criar conta"**
5. Você será automaticamente redirecionado para o Dashboard

### **2. Login**

1. Acesse: http://localhost:5173/login
2. Use as credenciais:
   - **Email:** teste@email.com
   - **Senha:** senha123
   
   OU suas próprias credenciais
3. Clique em **"Entrar"**

### **3. Navegação**

Use a **sidebar** à esquerda para navegar:
- 🏠 **Dashboard** - Visão geral
- 💵 **Transações** - Gerenciar transações
- ⚙️ **Configurações** - Preferências
- 🚪 **Sair** - Fazer logout

---

## 💡 Recursos Principais

### **Dashboard Interativo**

- **Estatísticas em tempo real:**
  - Total de gastos
  - Número de transações
  - Quantidade de categorias
  - Média por transação

- **Gráficos visuais:**
  - Distribuição por categoria (pizza)
  - Evolução mensal (barras)
  - Cores diferenciadas por categoria

- **Transações recentes:**
  - Últimas 5 transações
  - Cards com hover effect
  - Data formatada em português

### **Gestão de Transações**

**Criar nova transação:**
1. Clique em **"Nova Transação"**
2. Preencha o formulário:
   - Descrição (ex: "Compra no supermercado")
   - Categoria (selecione do dropdown)
   - Valor (apenas números)
   - Data
   - Cartão (opcional)
   - Parcelas (opcional)
3. Clique em **"Salvar Transação"**

**Buscar transações:**
- Use a barra de busca para filtrar por descrição ou categoria
- Use o filtro de categoria para ver apenas uma categoria específica

**Upload de fatura:**
1. Clique em **"Upload Fatura"**
2. Arraste ou selecione um arquivo (PDF ou imagem)
3. Clique em **"Fazer Upload"**
4. O sistema processará com OCR e extrairá o texto

---

## 🎨 Design e UX

### **Paleta de Cores**
- **Primária:** Azul (#3B82F6) - Ações principais
- **Sucesso:** Verde (#10B981) - Confirmações
- **Alerta:** Amarelo (#F59E0B) - Avisos
- **Erro:** Vermelho (#EF4444) - Erros
- **Roxo:** (#8B5CF6) - Destaques

### **Componentes Modernos**
- Cards com sombras suaves
- Botões com estados hover/active
- Inputs com foco destacado
- Transições suaves em todas as interações
- Ícones modernos (React Icons)
- Responsivo para mobile/tablet/desktop

### **Experiência do Usuário**
- **Feedback visual** para todas as ações
- **Loading states** durante processamento
- **Mensagens de erro** claras
- **Animações** suaves e não intrusivas
- **Responsivo** - funciona em qualquer dispositivo

---

## 📱 Responsividade

### **Desktop (>768px)**
- Sidebar lateral fixa
- Tabela completa de transações
- Gráficos lado a lado
- Layout em grid

### **Mobile (<768px)**
- Menu hamburger (futuro)
- Cards ao invés de tabela
- Gráficos empilhados
- Layout vertical

---

## 🔐 Segurança

- ✅ Autenticação via JWT
- ✅ Rotas protegidas
- ✅ Senhas não visíveis
- ✅ Token armazenado localmente
- ✅ Logout limpa sessão

---

## 🐛 Solução de Problemas

### **Não consigo fazer login**
- Verifique se o backend está rodando (Terminal 2)
- Confirme que o usuário existe
- Tente criar uma nova conta

### **Dashboard não carrega dados**
- Crie algumas transações primeiro
- Verifique o console do navegador (F12)
- Recarregue a página

### **Gráficos não aparecem**
- É necessário ter transações cadastradas
- Aguarde o carregamento completo
- Limpe o cache do navegador

### **Upload de fatura não funciona**
- Verifique se o arquivo é PDF ou imagem
- Tamanho máximo pode estar limitado
- Veja o console para erros

---

## 🎓 Dicas de Uso

1. **Organize por categorias:** Use categorias consistentes para melhor visualização
2. **Atualize regularmente:** Adicione transações assim que ocorrem
3. **Use o OCR:** Faça upload de faturas para extrair dados automaticamente
4. **Acompanhe o dashboard:** Visualize tendências de gastos
5. **Filtre por período:** Use a busca para encontrar transações específicas

---

## 🚧 Funcionalidades Futuras

- [ ] Editar/deletar transações
- [ ] Metas financeiras
- [ ] Exportar relatórios (PDF/Excel)
- [ ] Gráficos de tendências
- [ ] Comparativo mês a mês
- [ ] Alertas de gastos
- [ ] Dark mode
- [ ] Integração com bancos (Open Banking)
- [ ] Categorização automática com IA
- [ ] App mobile nativo

---

## 💬 Suporte

Se encontrar problemas:
1. Verifique os terminais de backend e frontend
2. Consulte o console do navegador (F12)
3. Revise as configurações do banco de dados
4. Reinicie os servidores se necessário

---

**Desenvolvido com ❤️ usando React + Express + PostgreSQL**


