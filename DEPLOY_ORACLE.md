# 🚀 Deploy no Oracle Cloud Free Tier

## 📋 Pré-requisitos

1. **VM Oracle Cloud** configurada (ARM ou AMD)
2. **Ubuntu 20.04+** ou Oracle Linux
3. **Portas liberadas** no Security List:
   - 80 (HTTP)
   - 443 (HTTPS)
   - 4000 (API - opcional)
   - 22 (SSH)

---

## 🔧 Passo 1: Configurar a VM

### Conectar via SSH:
```bash
ssh -i sua_chave.key ubuntu@SEU_IP_ORACLE
```

### Instalar Docker:
```bash
# Atualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar Docker
sudo apt install -y docker.io docker-compose

# Adicionar usuário ao grupo docker
sudo usermod -aG docker $USER

# Reiniciar para aplicar mudanças
sudo reboot
```

---

## 🔧 Passo 2: Clonar o Projeto

```bash
# Reconectar após reboot
ssh -i sua_chave.key ubuntu@SEU_IP_ORACLE

# Clonar repositório
git clone https://github.com/thallyson03/Meu_finaceiro.git
cd Meu_finaceiro
```

---

## 🔧 Passo 3: Configurar Variáveis de Ambiente

```bash
# Copiar arquivo de exemplo
cp .env.production.example .env

# Editar configurações
nano .env
```

### Configurações importantes no `.env`:
```env
# Senha segura para o banco
DB_PASSWORD=SuaSenhaSegura123!

# JWT Secret (gere uma chave única!)
JWT_SECRET=sua_chave_jwt_super_secreta_aqui_2024

# URL da API (substitua pelo seu IP)
API_URL=http://SEU_IP_ORACLE/api
```

---

## 🔧 Passo 4: Executar Deploy

```bash
# Dar permissão ao script
chmod +x deploy.sh

# Executar deploy
./deploy.sh
```

---

## 🔧 Passo 5: Liberar Portas no Oracle Cloud

### No Console Oracle Cloud:

1. Acesse **Networking > Virtual Cloud Networks**
2. Clique na sua **VCN**
3. Clique em **Security Lists**
4. Clique na **Default Security List**
5. Adicione **Ingress Rules**:

| Source CIDR | Protocol | Destination Port |
|-------------|----------|------------------|
| 0.0.0.0/0   | TCP      | 80               |
| 0.0.0.0/0   | TCP      | 443              |
| 0.0.0.0/0   | TCP      | 4000             |

### No Firewall da VM (Ubuntu):
```bash
sudo iptables -I INPUT -p tcp --dport 80 -j ACCEPT
sudo iptables -I INPUT -p tcp --dport 443 -j ACCEPT
sudo iptables -I INPUT -p tcp --dport 4000 -j ACCEPT
sudo netfilter-persistent save
```

---

## ✅ Verificar Deploy

### Ver status dos containers:
```bash
docker-compose -f docker-compose.prod.yml ps
```

### Ver logs:
```bash
docker-compose -f docker-compose.prod.yml logs -f
```

### Testar API:
```bash
curl http://localhost:4000/api/auth
```

---

## 🌐 Acessar a Aplicação

Após o deploy, acesse:

- **Frontend:** `http://SEU_IP_ORACLE`
- **API:** `http://SEU_IP_ORACLE/api`

### Credenciais de teste:
- **Email:** admin@teste.com
- **Senha:** admin123

---

## 🔄 Comandos Úteis

```bash
# Parar aplicação
docker-compose -f docker-compose.prod.yml down

# Reiniciar aplicação
docker-compose -f docker-compose.prod.yml restart

# Ver logs em tempo real
docker-compose -f docker-compose.prod.yml logs -f

# Atualizar aplicação (após git pull)
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml build --no-cache
docker-compose -f docker-compose.prod.yml up -d

# Acessar container do backend
docker-compose -f docker-compose.prod.yml exec backend sh

# Acessar banco de dados
docker-compose -f docker-compose.prod.yml exec db psql -U postgres -d meu_financeiro
```

---

## 🔒 Configurar HTTPS (Opcional)

Para adicionar SSL/HTTPS gratuito com Let's Encrypt:

```bash
# Instalar Certbot
sudo apt install -y certbot

# Gerar certificado (substitua seu domínio)
sudo certbot certonly --standalone -d seudominio.com

# Copiar certificados para pasta do nginx
sudo cp /etc/letsencrypt/live/seudominio.com/fullchain.pem ./nginx/ssl/
sudo cp /etc/letsencrypt/live/seudominio.com/privkey.pem ./nginx/ssl/
```

---

## 🆘 Solução de Problemas

### Erro: "Cannot connect to database"
```bash
# Verificar se o banco está rodando
docker-compose -f docker-compose.prod.yml logs db

# Reiniciar banco
docker-compose -f docker-compose.prod.yml restart db
```

### Erro: "Port 80 already in use"
```bash
# Verificar processo usando a porta
sudo lsof -i :80

# Parar nginx se estiver rodando
sudo systemctl stop nginx
```

### Erro: "Permission denied"
```bash
# Adicionar usuário ao grupo docker
sudo usermod -aG docker $USER
newgrp docker
```

---

## 📊 Monitoramento

### Ver uso de recursos:
```bash
docker stats
```

### Ver espaço em disco:
```bash
df -h
docker system df
```

### Limpar recursos não utilizados:
```bash
docker system prune -a
```

---

## 🎉 Pronto!

Sua aplicação está rodando no Oracle Cloud Free Tier!

**Acesse:** `http://SEU_IP_ORACLE`

