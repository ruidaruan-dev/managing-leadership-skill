import { useLocalStorage } from './useLocalStorage'
import type { LeaderNode, InteractionTask, InteractionOutcome } from '@/types/network'

export function useLeaderNetwork() {
  const [leaders, setLeaders] = useLocalStorage<LeaderNode[]>('leader-network-nodes', [])
  const [tasks, setTasks] = useLocalStorage<InteractionTask[]>('leader-network-tasks', [])

  const addLeader = (data: Omit<LeaderNode, 'id' | 'createdAt' | 'updatedAt'>) => {
    const node: LeaderNode = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    setLeaders(prev => [...prev, node])
    return node
  }

  const updateLeader = (id: string, data: Partial<LeaderNode>) => {
    setLeaders(prev =>
      prev.map(l => l.id === id ? { ...l, ...data, updatedAt: new Date().toISOString() } : l)
    )
  }

  const deleteLeader = (id: string) => {
    setLeaders(prev => prev.filter(l => l.id !== id))
    setTasks(prev => prev.filter(t => t.leaderId !== id))
  }

  const addTask = (data: Omit<InteractionTask, 'id' | 'createdAt'>) => {
    const task: InteractionTask = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    }
    setTasks(prev => [...prev, task])
    return task
  }

  const updateTask = (id: string, data: Partial<InteractionTask>) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...data } : t))
  }

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id))
  }

  const completeTask = (id: string) => {
    updateTask(id, { status: 'done', completedAt: new Date().toISOString() })
  }

  const logTaskOutcome = (id: string, data: { outcome: InteractionOutcome; actualResult: string; lessonsLearned: string }) => {
    updateTask(id, data)
  }

  return {
    leaders,
    tasks,
    addLeader,
    updateLeader,
    deleteLeader,
    addTask,
    updateTask,
    deleteTask,
    completeTask,
    logTaskOutcome,
  }
}
