# Meu Planejamento Financeiro - Projeto gerado

Estrutura mínima do projeto com backend (Node.js + Express + Prisma) e frontend (Vite + React).

## Rodando com Docker (recomendado)
1. Copie `.env.example` para `backend/.env` e ajuste se necessário.
2. `docker-compose up --build`

## Rodando local sem Docker
### Backend
```
cd backend
npm install
# configurar .env
npx prisma generate
npx prisma migrate dev --name init
npm run dev
```

### Frontend
```
cd web
npm install
npm run dev
```

Observações:
- OCR em produção: converter PDF para imagens (pdftoppm) antes de usar Tesseract.
- Trocar JWT_SECRET e tomar medidas de segurança antes de colocar em produção.
