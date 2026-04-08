import { useCallback } from 'react'
import { useLocalStorage } from './useLocalStorage'
import type { Reminder } from '@/types/pet'

export function useReminders() {
  const [reminders, setReminders] = useLocalStorage<Reminder[]>('ml-reminders', [])

  const addReminder = useCallback((reminder: Omit<Reminder, 'id' | 'createdAt' | 'completed'>) => {
    const newReminder: Reminder = {
      ...reminder,
      id: crypto.randomUUID(),
      completed: false,
      createdAt: new Date().toISOString(),
    }
    setReminders(prev => [newReminder, ...prev])
    return newReminder.id
  }, [setReminders])

  const completeReminder = useCallback((id: string) => {
    setReminders(prev => prev.map(r => r.id === id ? { ...r, completed: true } : r))
  }, [setReminders])

  const deleteReminder = useCallback((id: string) => {
    setReminders(prev => prev.filter(r => r.id !== id))
  }, [setReminders])

  const activeReminders = reminders.filter(r => !r.completed)
  const completedReminders = reminders.filter(r => r.completed)

  return {
    reminders,
    activeReminders,
    completedReminders,
    addReminder,
    completeReminder,
    deleteReminder,
  }
}
