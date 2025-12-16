#!/bin/bash

# ===========================================
# Script de Deploy - Meu Planejamento Financeiro
# Oracle Cloud Free Tier
# ===========================================

set -e

echo "🚀 Iniciando deploy..."

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Verificar se Docker está instalado
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker não está instalado!${NC}"
    echo "Execute: sudo apt update && sudo apt install -y docker.io docker-compose"
    exit 1
fi

# Verificar se docker-compose está instalado
if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}❌ Docker Compose não está instalado!${NC}"
    echo "Execute: sudo apt install -y docker-compose"
    exit 1
fi

# Verificar arquivo .env
if [ ! -f .env ]; then
    echo -e "${YELLOW}⚠️  Arquivo .env não encontrado!${NC}"
    echo "Criando a partir do exemplo..."
    cp .env.production.example .env
    echo -e "${YELLOW}📝 Por favor, edite o arquivo .env com suas configurações!${NC}"
    echo "   nano .env"
    exit 1
fi

# Parar containers existentes
echo -e "${YELLOW}🛑 Parando containers existentes...${NC}"
docker-compose -f docker-compose.prod.yml down 2>/dev/null || true

# Limpar imagens antigas (opcional)
echo -e "${YELLOW}🧹 Limpando imagens antigas...${NC}"
docker system prune -f 2>/dev/null || true

# Build das imagens
echo -e "${YELLOW}🔨 Construindo imagens Docker...${NC}"
docker-compose -f docker-compose.prod.yml build --no-cache

# Iniciar containers
echo -e "${YELLOW}🚀 Iniciando containers...${NC}"
docker-compose -f docker-compose.prod.yml up -d

# Aguardar o banco de dados ficar pronto
echo -e "${YELLOW}⏳ Aguardando banco de dados...${NC}"
sleep 10

# Executar migrations do Prisma
echo -e "${YELLOW}📦 Executando migrations...${NC}"
docker-compose -f docker-compose.prod.yml exec -T backend npx prisma migrate deploy 2>/dev/null || \
docker-compose -f docker-compose.prod.yml exec -T backend npx prisma db push

# Verificar status
echo -e "${YELLOW}📊 Verificando status dos containers...${NC}"
docker-compose -f docker-compose.prod.yml ps

# Obter IP público
PUBLIC_IP=$(curl -s ifconfig.me 2>/dev/null || echo "SEU_IP")

echo ""
echo -e "${GREEN}✅ Deploy concluído com sucesso!${NC}"
echo ""
echo "========================================"
echo "🌐 Acesse sua aplicação em:"
echo "   http://${PUBLIC_IP}"
echo ""
echo "📊 API Backend:"
echo "   http://${PUBLIC_IP}:4000/api"
echo ""
echo "🔐 Credenciais padrão:"
echo "   Email: admin@teste.com"
echo "   Senha: admin123"
echo "========================================"
echo ""
echo -e "${YELLOW}📝 Comandos úteis:${NC}"
echo "   Ver logs: docker-compose -f docker-compose.prod.yml logs -f"
echo "   Parar: docker-compose -f docker-compose.prod.yml down"
echo "   Reiniciar: docker-compose -f docker-compose.prod.yml restart"

