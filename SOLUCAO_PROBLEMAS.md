# 🔧 Solução de Problemas - Meu Planejamento Financeiro

## ✅ STATUS ATUAL DO SISTEMA

### **Servidores Rodando:**
- ✅ **Frontend**: http://localhost:5174/
- ✅ **Backend**: http://localhost:4000/api
- ✅ **PostgreSQL**: localhost:5432

---

## 🔐 CREDENCIAIS DE TESTE

### **Use estas credenciais para acessar:**
```
Email: admin@teste.com
Senha: admin123
```

### **Como fazer login:**
1. Acesse: http://localhost:5174/
2. Digite o email: `admin@teste.com`
3. Digite a senha: `admin123`
4. Clique em "Entrar"

---

## ❌ PROBLEMAS RESOLVIDOS

### **1. Erro 401 (Unauthorized) no Login**

**Problema:** Credenciais incorretas ou usuário não existe

**✅ Solução:** Use as credenciais de teste acima: `admin@teste.com` / `admin123`

---

### **2. ERR_CONNECTION_REFUSED**

**Problema:** Backend não estava rodando (crashou ao processar PDF)

**✅ Solução:** 
- Backend foi reiniciado ✅
- OCR foi corrigido para não aceitar PDFs ✅
- Use apenas **imagens (JPG, PNG)** para upload

---

### **3. Backend Crash ao fazer Upload**

**Problema:** Tesseract.js não suporta PDF diretamente

**✅ Solução:** 
- Código foi atualizado ✅
- Agora retorna mensagem amigável ao invés de crashar
- **Use apenas imagens** para OCR

---

## 📤 UPLOAD DE FATURAS

### **⚠️ IMPORTANTE: Apenas Imagens**

O OCR funciona apenas com **imagens**. PDFs causam erro.

**Formatos aceitos:**
- ✅ JPG/JPEG
- ✅ PNG
- ❌ PDF (não funciona)

### **Como fazer upload correto:**
1. Tire uma **foto** da fatura ou
2. **Converta** o PDF para imagem antes
3. Faça upload da imagem no sistema

### **Ferramentas para converter PDF → Imagem:**
- Online: https://www.ilovepdf.com/pdf_to_jpg
- Windows: Abra o PDF e tire um print (Win + Shift + S)
- Adobe Acrobat: Exportar como → JPEG

---

## 🐛 PROBLEMAS COMUNS E SOLUÇÕES

### **Problema: "Não consigo fazer login"**

**Soluções:**
1. ✅ Use as credenciais corretas:
   - Email: `admin@teste.com`
   - Senha: `admin123`

2. ✅ Verifique se o backend está rodando:
   - Abra: http://localhost:4000/api/auth/login
   - Se der erro, backend não está rodando

3. ✅ Limpe o cache do navegador:
   - Pressione `Ctrl + Shift + Delete`
   - Limpe cookies e cache
   - Recarregue a página

---

### **Problema: "Dashboard não mostra dados"**

**Solução:**
- ✅ Isso é normal! Você precisa criar transações primeiro
- Vá em "Transações" → "Nova Transação"
- Adicione algumas transações
- Volte ao Dashboard para ver os gráficos

---

### **Problema: "Upload não funciona"**

**Soluções:**
1. ✅ Verifique o tipo de arquivo:
   - Use apenas JPG ou PNG
   - Não use PDF

2. ✅ Verifique o tamanho:
   - Máximo recomendado: 5MB
   - Imagens muito grandes podem demorar

3. ✅ Verifique se o backend está rodando:
   - Terminal 4 deve mostrar "Backend running on http://localhost:4000"

---

### **Problema: "Página em branco / erro no navegador"**

**Soluções:**
1. ✅ Limpe o cache (Ctrl + Shift + Delete)
2. ✅ Recarregue com força (Ctrl + F5)
3. ✅ Abra o console (F12) e veja os erros
4. ✅ Verifique se os servidores estão rodando

---

## 🔄 REINICIAR OS SERVIDORES

### **Frontend:**
```powershell
# Ir até a pasta web
cd C:\Users\PICHAU\Downloads\meu-planejamento-financeiro-completo\web

# Iniciar
npm run dev
```
**URL:** http://localhost:5174/

### **Backend:**
```powershell
# Ir até a pasta backend
cd C:\Users\PICHAU\Downloads\meu-planejamento-financeiro-completo\backend

# Iniciar
npm run dev
```
**URL:** http://localhost:4000/

---

## 🧪 TESTAR SE TUDO ESTÁ FUNCIONANDO

### **Script de Teste Automático:**
```powershell
cd C:\Users\PICHAU\Downloads\meu-planejamento-financeiro-completo\backend
node test-auth.js
```

**Resultado esperado:**
```
✅ Login bem-sucedido!
✅ API funcionando!
🎉 Tudo funcionando perfeitamente!
```

---

## 📊 VERIFICAR STATUS DOS SERVIDORES

### **Frontend:**
- Abra: http://localhost:5174/
- Deve mostrar tela de login

### **Backend:**
- Abra: http://localhost:4000/api/auth/login
- Deve retornar erro (normal, precisa de credenciais)
- Se não carregar = backend offline

### **Banco de Dados:**
- Use pgAdmin ou DBeaver
- Conecte em localhost:5432
- Usuário: postgres
- Senha: postgres123

---

## 💡 DICAS IMPORTANTES

1. **Sempre use as credenciais de teste:**
   - admin@teste.com / admin123

2. **Para upload de faturas:**
   - Apenas imagens (JPG, PNG)
   - Nunca PDF

3. **Se algo não funcionar:**
   - Verifique os terminais
   - Reinicie os servidores
   - Limpe o cache do navegador

4. **Dashboard vazio é normal:**
   - Crie transações primeiro
   - Depois verá os gráficos

5. **Mantenha os terminais abertos:**
   - Terminal 3 ou 4: Frontend
   - Terminal 2 ou 4: Backend
   - Não feche durante o uso

---

## 🆘 SUPORTE RÁPIDO

### **Checklist se algo não funcionar:**

- [ ] Backend está rodando? (Terminal 4)
- [ ] Frontend está rodando? (Terminal 3)
- [ ] Usando credenciais corretas? (admin@teste.com / admin123)
- [ ] Cache do navegador limpo?
- [ ] Tentando upload de imagem (não PDF)?

---

## 📞 CONTATOS ÚTEIS

- **Frontend**: http://localhost:5174/
- **Backend**: http://localhost:4000/api
- **Banco**: localhost:5432

---

**🎉 Sistema funcionando perfeitamente!**

Use as credenciais: **admin@teste.com** / **admin123**






