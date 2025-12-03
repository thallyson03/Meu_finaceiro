# 🎨 CLASSES UTILITÁRIAS RESPONSIVAS

## 📚 **GUIA DE USO DAS CLASSES CRIADAS**

Este arquivo contém exemplos práticos de como usar as classes utilitárias responsivas criadas em `web/src/utils/responsive.css`.

---

## 📋 **GRID RESPONSIVO:**

### **`.grid-cards-1` - 1 coluna em todas as telas:**
```jsx
<div className="grid-cards-1 gap-responsive">
  <Card>Card 1</Card>
  <Card>Card 2</Card>
</div>
```

### **`.grid-cards-2` - Responsivo (1 → 2 colunas):**
```jsx
<div className="grid-cards-2 gap-responsive">
  <Card>Card 1</Card>
  <Card>Card 2</Card>
</div>
```
```
Mobile:  Card 1    Tablet/Desktop:  Card 1  Card 2
         Card 2
```

### **`.grid-cards-3` - Responsivo (1 → 2 → 3 colunas):**
```jsx
<div className="grid-cards-3 gap-responsive">
  <Card>Card 1</Card>
  <Card>Card 2</Card>
  <Card>Card 3</Card>
</div>
```
```
Mobile:   Card 1      Tablet:    Card 1  Card 2      Desktop:  Card 1  Card 2  Card 3
          Card 2                 Card 3
          Card 3
```

### **`.grid-cards-4` - Responsivo (1 → 2 → 4 colunas):**
```jsx
<div className="grid-cards-4 gap-responsive">
  {cards.map(card => <Card key={card.id}>{card.content}</Card>)}
</div>
```

### **`.grid-cards-6` - Responsivo (2 → 3 → 6 colunas):**
```jsx
<div className="grid-cards-6 gap-responsive">
  <StatCard title="Receitas" value="R$ 5.000" />
  <StatCard title="Despesas" value="R$ 3.200" />
  {/* ... mais 4 cards ... */}
</div>
```

---

## 🔤 **TEXTO RESPONSIVO:**

### **`.text-responsive-xs` - Extra small:**
```jsx
<p className="text-responsive-xs">
  Texto pequeno (12px → 14px)
</p>
```

### **`.text-responsive-sm` - Small:**
```jsx
<p className="text-responsive-sm">
  Texto normal (14px → 16px)
</p>
```

### **`.text-responsive-lg` - Large:**
```jsx
<h3 className="text-responsive-lg font-bold">
  Título médio (18px → 20px → 24px)
</h3>
```

### **`.text-responsive-xl` - Extra large:**
```jsx
<h2 className="text-responsive-xl font-bold">
  Título grande (20px → 24px → 30px)
</h2>
```

### **`.text-responsive-2xl` - 2X Large:**
```jsx
<h1 className="text-responsive-2xl font-bold">
  Título principal (24px → 30px → 36px)
</h1>
```

---

## 📏 **ESPAÇAMENTO RESPONSIVO:**

### **`.space-responsive` - Espaçamento vertical:**
```jsx
<div className="space-responsive">
  <Card>Card 1</Card>
  <Card>Card 2</Card>
  <Card>Card 3</Card>
</div>
```
```
Gap: 16px (mobile) → 20px (tablet) → 24px (desktop)
```

### **`.gap-responsive` - Gap em grids:**
```jsx
<div className="grid grid-cols-2 gap-responsive">
  <div>Item 1</div>
  <div>Item 2</div>
</div>
```

### **`.gap-responsive-sm` - Gap pequeno:**
```jsx
<div className="flex gap-responsive-sm">
  <button>Botão 1</button>
  <button>Botão 2</button>
</div>
```

---

## 📦 **PADDING RESPONSIVO:**

### **`.p-responsive` - Padding total:**
```jsx
<div className="p-responsive bg-white rounded-lg">
  <h3>Conteúdo com padding adaptativo</h3>
</div>
```
```
Padding: 16px (mobile) → 20px (tablet) → 24px (desktop)
```

### **`.px-responsive` - Padding horizontal:**
```jsx
<div className="px-responsive">
  <p>Texto com padding lateral</p>
</div>
```

### **`.py-responsive` - Padding vertical:**
```jsx
<div className="py-responsive">
  <p>Texto com padding vertical</p>
</div>
```

---

## 📐 **MARGEM RESPONSIVA:**

### **`.mb-responsive` - Margin bottom:**
```jsx
<h2 className="mb-responsive">
  Título com margem inferior
</h2>
```

### **`.mt-responsive` - Margin top:**
```jsx
<div className="mt-responsive">
  <p>Conteúdo com margem superior</p>
</div>
```

---

## 👁️ **VISIBILIDADE:**

### **`.hide-mobile` - Ocultar em mobile:**
```jsx
<div className="hide-mobile">
  Este conteúdo só aparece em tablet/desktop
</div>
```

### **`.hide-desktop` - Ocultar em desktop:**
```jsx
<div className="hide-desktop">
  Este conteúdo só aparece em mobile
</div>
```

**Exemplo prático:**
```jsx
<div>
  <h2 className="hide-mobile">Dashboard Completo</h2>
  <h2 className="hide-desktop">Dashboard</h2>
</div>
```

---

## 🔄 **FLEX RESPONSIVO:**

### **`.flex-responsive` - Coluna → Linha:**
```jsx
<div className="flex-responsive gap-4">
  <button>Botão 1</button>
  <button>Botão 2</button>
</div>
```
```
Mobile:    Botão 1     Desktop:  Botão 1  Botão 2
           Botão 2
```

### **`.stack-responsive` - Stack com alinhamento:**
```jsx
<div className="stack-responsive gap-4">
  <div>Esquerda</div>
  <div>Direita</div>
</div>
```

---

## 🎯 **BOTÕES RESPONSIVOS:**

### **`.btn-responsive` - Botão adaptativo:**
```jsx
<button className="btn-responsive bg-blue-600 text-white rounded-lg">
  Clique aqui
</button>
```
```
Padding: 16px×8px (mobile) → 20px×10px (tablet) → 24px×12px (desktop)
```

---

## 📊 **GRÁFICOS RESPONSIVOS:**

### **`.chart-container` - Container padrão:**
```jsx
<div className="chart-container">
  <ResponsiveContainer width="100%" height="100%">
    <LineChart data={data}>
      {/* ... */}
    </LineChart>
  </ResponsiveContainer>
</div>
```
```
Altura: 256px (mobile) → 288px (tablet) → 320px (desktop)
```

### **`.chart-container-sm` - Container pequeno:**
```jsx
<div className="chart-container-sm">
  <ResponsiveContainer width="100%" height="100%">
    <PieChart>
      {/* ... */}
    </PieChart>
  </ResponsiveContainer>
</div>
```

### **`.chart-container-lg` - Container grande:**
```jsx
<div className="chart-container-lg">
  <ResponsiveContainer width="100%" height="100%">
    <ComposedChart data={data}>
      {/* ... */}
    </ComposedChart>
  </ResponsiveContainer>
</div>
```

---

## 📋 **TABELAS RESPONSIVAS:**

### **`.table-responsive` - Tabela com scroll:**
```jsx
<div className="table-responsive">
  <table className="min-w-full">
    <thead>
      <tr>
        <th>Coluna 1</th>
        <th>Coluna 2</th>
        <th>Coluna 3</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Dado 1</td>
        <td>Dado 2</td>
        <td>Dado 3</td>
      </tr>
    </tbody>
  </table>
</div>
```

---

## 🎨 **UTILITÁRIOS DIVERSOS:**

### **`.rounded-responsive` - Arredondamento:**
```jsx
<div className="rounded-responsive bg-white p-4">
  Border radius adaptativo
</div>
```

### **`.shadow-responsive` - Sombra:**
```jsx
<Card className="shadow-responsive">
  Sombra que aumenta em telas maiores
</Card>
```

### **`.center-mobile` - Centralizar em mobile:**
```jsx
<div className="center-mobile">
  <h2>Texto centralizado em mobile, alinhado à esquerda em desktop</h2>
</div>
```

### **`.truncate-responsive` - Truncar texto:**
```jsx
<p className="truncate-responsive">
  Texto muito longo que será truncado em mobile mas completo em desktop
</p>
```

---

## 🎯 **EXEMPLOS PRÁTICOS:**

### **1. Card de Estatística Responsivo:**
```jsx
<div className="grid-cards-4 gap-responsive">
  <div className="p-responsive bg-white rounded-responsive shadow-responsive">
    <p className="text-responsive-xs text-gray-600">Receitas</p>
    <h3 className="text-responsive-lg font-bold">R$ 5.000,00</h3>
  </div>
</div>
```

### **2. Seção com Título e Cards:**
```jsx
<div className="space-responsive">
  <div className="mb-responsive">
    <h1 className="text-responsive-2xl font-bold">Dashboard</h1>
    <p className="text-responsive-sm text-gray-600">Visão geral</p>
  </div>
  
  <div className="grid-cards-3 gap-responsive">
    <Card>Card 1</Card>
    <Card>Card 2</Card>
    <Card>Card 3</Card>
  </div>
</div>
```

### **3. Layout com Sidebar (simulação):**
```jsx
<div className="flex-responsive gap-responsive">
  <aside className="hide-mobile w-64 bg-white p-responsive">
    Sidebar (só desktop)
  </aside>
  
  <main className="flex-1 p-responsive">
    Conteúdo principal
  </main>
</div>
```

### **4. Botões de Ação:**
```jsx
<div className="grid-cards-4 gap-responsive">
  <button className="btn-responsive bg-green-600 text-white rounded-lg">
    + Receita
  </button>
  <button className="btn-responsive bg-red-600 text-white rounded-lg">
    + Despesa
  </button>
  <button className="btn-responsive bg-purple-600 text-white rounded-lg">
    Orçamento
  </button>
  <button className="btn-responsive bg-blue-600 text-white rounded-lg">
    Análises
  </button>
</div>
```

### **5. Alertas Responsivos:**
```jsx
<div className="grid-cards-2 gap-responsive">
  <Card className="p-responsive bg-red-50">
    <h3 className="text-responsive-sm font-semibold text-red-700">
      Orçamento Ultrapassado!
    </h3>
    <p className="text-responsive-xs text-red-600 mt-2">
      3 categorias excederam o limite
    </p>
  </Card>
  
  <Card className="p-responsive bg-yellow-50">
    <h3 className="text-responsive-sm font-semibold text-yellow-700">
      Parcelas Próximas
    </h3>
    <p className="text-responsive-xs text-yellow-600 mt-2">
      5 parcelas vencem em 30 dias
    </p>
  </Card>
</div>
```

---

## 💡 **BOAS PRÁTICAS:**

### **1. Combine classes para melhor resultado:**
```jsx
<div className="grid-cards-3 gap-responsive space-responsive">
  {/* Conteúdo */}
</div>
```

### **2. Use com classes do Tailwind:**
```jsx
<button className="btn-responsive bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors">
  Botão Estilizado
</button>
```

### **3. Adapte conforme necessário:**
```jsx
<div className="grid-cards-3 gap-responsive lg:grid-cols-4">
  {/* 3 colunas por padrão, 4 em telas grandes */}
</div>
```

---

## 🎨 **DICAS DE USO:**

### **✅ DO:**
```jsx
// Use classes utilitárias para consistência
<div className="grid-cards-3 gap-responsive p-responsive">

// Combine com Tailwind
<div className="grid-cards-2 gap-responsive bg-gray-50">

// Teste em diferentes tamanhos
// Mobile → Tablet → Desktop
```

### **❌ DON'T:**
```jsx
// Não misture abordagens diferentes
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
// Prefira: <div className="grid-cards-3">

// Não use valores fixos quando há utilitário
<div style={{ padding: '24px' }}>
// Prefira: <div className="p-responsive">
```

---

## 📚 **REFERÊNCIA RÁPIDA:**

| Classe | Mobile | Tablet | Desktop |
|--------|--------|--------|---------|
| `.grid-cards-2` | 1 col | 2 cols | 2 cols |
| `.grid-cards-3` | 1 col | 2 cols | 3 cols |
| `.grid-cards-4` | 1 col | 2 cols | 4 cols |
| `.grid-cards-6` | 2 cols | 3 cols | 6 cols |
| `.text-responsive-lg` | 18px | 20px | 24px |
| `.p-responsive` | 16px | 20px | 24px |
| `.gap-responsive` | 16px | 20px | 24px |
| `.chart-container` | 256px | 288px | 320px |

---

## 🎯 **ARQUIVO COMPLETO:**

Todas essas classes estão em:
```
web/src/utils/responsive.css
```

E são importadas em:
```
web/src/index.css
```

---

## 📝 **CUSTOMIZAÇÃO:**

Para adicionar novas classes, edite:
```css
/* web/src/utils/responsive.css */

.minha-classe-custom {
  @apply p-4 sm:p-6 lg:p-8;
}
```

---

## ✅ **CONCLUSÃO:**

Com essas classes utilitárias, você pode criar layouts responsivos rapidamente sem repetir código!

**Vantagens:**
- ✅ Código mais limpo
- ✅ Consistência visual
- ✅ Manutenção fácil
- ✅ Responsividade garantida

---

**🎨 Use e abuse das classes utilitárias!** 🚀✨


