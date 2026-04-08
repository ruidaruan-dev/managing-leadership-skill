export type GridCategory = 'power' | 'system' | 'crosser' | 'wildcard'

export interface GridCategoryInfo {
  label: string
  labelEn: string
  icon: string
  description: string
}

export interface PetState {
  selectedLeaderId: number | null
  petNickname: string
  totalWhips: number
  whipHistory: { quote: string; timestamp: string }[]
  createdAt: string
  lastInteraction: string
}

export interface Reminder {
  id: string
  leaderId: number
  text: string
  scheduledTime: string
  repeatFrequency: 'once' | 'weekly' | 'biweekly' | 'monthly'
  completed: boolean
  source: 'suggested' | 'custom'
  createdAt: string
}

export interface TacticalTip {
  text: string
  frequency: 'weekly' | 'biweekly' | 'monthly'
  category: 'flattery' | 'visibility' | 'protection' | 'intelligence'
}

export interface PetDialogue {
  defeatLines: string[]
  painReaction: 'bounce' | 'spin' | 'shrink' | 'shake'
  catchphrase: string
}
