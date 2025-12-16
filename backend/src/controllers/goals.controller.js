const prisma = require('../lib/prismaClient')

// Listar todas as metas do usuário
async function getGoals(req, res) {
  try {
    const goals = await prisma.goal.findMany({
      where: { userId: req.userId },
      orderBy: { createdAt: 'desc' }
    })

    // Calcular progresso e estatísticas
    const goalsWithProgress = goals.map(goal => ({
      ...goal,
      progress: goal.targetAmount > 0 
        ? Math.min((goal.currentAmount / goal.targetAmount) * 100, 100) 
        : 0,
      remaining: Math.max(goal.targetAmount - goal.currentAmount, 0),
      monthlyNeeded: goal.deadline 
        ? calculateMonthlyNeeded(goal.targetAmount, goal.currentAmount, goal.deadline)
        : null
    }))

    // Resumo geral
    const summary = {
      totalGoals: goals.length,
      completedGoals: goals.filter(g => g.isCompleted).length,
      activeGoals: goals.filter(g => !g.isCompleted).length,
      totalTargetAmount: goals.reduce((sum, g) => sum + g.targetAmount, 0),
      totalCurrentAmount: goals.reduce((sum, g) => sum + g.currentAmount, 0),
      overallProgress: goals.length > 0
        ? (goals.reduce((sum, g) => sum + g.currentAmount, 0) / 
           goals.reduce((sum, g) => sum + g.targetAmount, 0)) * 100
        : 0
    }

    res.json({ goals: goalsWithProgress, summary })
  } catch (error) {
    console.error('Erro ao buscar metas:', error)
    res.status(500).json({ error: 'Erro ao buscar metas' })
  }
}

// Criar nova meta
async function createGoal(req, res) {
  try {
    const { name, targetAmount, currentAmount, deadline, category, color, icon } = req.body

    if (!name || !targetAmount) {
      return res.status(400).json({ error: 'Nome e valor alvo são obrigatórios' })
    }

    const goal = await prisma.goal.create({
      data: {
        userId: req.userId,
        name,
        targetAmount: parseFloat(targetAmount),
        currentAmount: parseFloat(currentAmount || 0),
        deadline: deadline ? new Date(deadline) : null,
        category: category || 'Outros',
        color: color || '#3B82F6',
        icon: icon || 'piggy-bank',
        isCompleted: parseFloat(currentAmount || 0) >= parseFloat(targetAmount)
      }
    })

    res.status(201).json(goal)
  } catch (error) {
    console.error('Erro ao criar meta:', error)
    res.status(500).json({ error: 'Erro ao criar meta' })
  }
}

// Atualizar meta (incluindo adicionar valor)
async function updateGoal(req, res) {
  try {
    const { id } = req.params
    const { name, targetAmount, currentAmount, deadline, category, color, icon, addAmount } = req.body

    const existingGoal = await prisma.goal.findFirst({
      where: { id: parseInt(id), userId: req.userId }
    })

    if (!existingGoal) {
      return res.status(404).json({ error: 'Meta não encontrada' })
    }

    // Se addAmount foi passado, adicionar ao valor atual
    let newCurrentAmount = currentAmount !== undefined 
      ? parseFloat(currentAmount) 
      : existingGoal.currentAmount

    if (addAmount) {
      newCurrentAmount = existingGoal.currentAmount + parseFloat(addAmount)
    }

    const newTargetAmount = targetAmount !== undefined 
      ? parseFloat(targetAmount) 
      : existingGoal.targetAmount

    const goal = await prisma.goal.update({
      where: { id: parseInt(id) },
      data: {
        name: name || existingGoal.name,
        targetAmount: newTargetAmount,
        currentAmount: newCurrentAmount,
        deadline: deadline ? new Date(deadline) : existingGoal.deadline,
        category: category || existingGoal.category,
        color: color || existingGoal.color,
        icon: icon || existingGoal.icon,
        isCompleted: newCurrentAmount >= newTargetAmount
      }
    })

    res.json(goal)
  } catch (error) {
    console.error('Erro ao atualizar meta:', error)
    res.status(500).json({ error: 'Erro ao atualizar meta' })
  }
}

// Deletar meta
async function deleteGoal(req, res) {
  try {
    const { id } = req.params

    const existingGoal = await prisma.goal.findFirst({
      where: { id: parseInt(id), userId: req.userId }
    })

    if (!existingGoal) {
      return res.status(404).json({ error: 'Meta não encontrada' })
    }

    await prisma.goal.delete({
      where: { id: parseInt(id) }
    })

    res.json({ message: 'Meta excluída com sucesso' })
  } catch (error) {
    console.error('Erro ao excluir meta:', error)
    res.status(500).json({ error: 'Erro ao excluir meta' })
  }
}

// Adicionar valor à meta
async function addToGoal(req, res) {
  try {
    const { id } = req.params
    const { amount } = req.body

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Valor deve ser maior que zero' })
    }

    const existingGoal = await prisma.goal.findFirst({
      where: { id: parseInt(id), userId: req.userId }
    })

    if (!existingGoal) {
      return res.status(404).json({ error: 'Meta não encontrada' })
    }

    const newCurrentAmount = existingGoal.currentAmount + parseFloat(amount)

    const goal = await prisma.goal.update({
      where: { id: parseInt(id) },
      data: {
        currentAmount: newCurrentAmount,
        isCompleted: newCurrentAmount >= existingGoal.targetAmount
      }
    })

    res.json(goal)
  } catch (error) {
    console.error('Erro ao adicionar valor à meta:', error)
    res.status(500).json({ error: 'Erro ao adicionar valor à meta' })
  }
}

// Função auxiliar para calcular quanto poupar por mês
function calculateMonthlyNeeded(targetAmount, currentAmount, deadline) {
  const remaining = targetAmount - currentAmount
  if (remaining <= 0) return 0
  
  const now = new Date()
  const deadlineDate = new Date(deadline)
  const monthsDiff = (deadlineDate.getFullYear() - now.getFullYear()) * 12 + 
                     (deadlineDate.getMonth() - now.getMonth())
  
  if (monthsDiff <= 0) return remaining
  return remaining / monthsDiff
}

module.exports = {
  getGoals,
  createGoal,
  updateGoal,
  deleteGoal,
  addToGoal
}

