export type RelationshipLevel = 'close' | 'normal' | 'cautious' | 'tense'
export type InteractionGoal = 'align' | 'report' | 'request' | 'build' | 'repair' | 'negotiate'
export type TaskStatus = 'pending' | 'done' | 'cancelled'
export type TaskPriority = 'high' | 'medium' | 'low'

export interface PersonalityTrait {
  key: string
  label: string
  value: string
}

export interface LeaderNode {
  id: string
  name: string
  title: string
  department: string
  archetypeId: number | null
  relationshipLevel: RelationshipLevel
  personalityNotes: string
  behaviorPatterns: string
  preferences: string
  avoidances: string
  customTraits: PersonalityTrait[]
  createdAt: string
  updatedAt: string
}

export interface InteractionTask {
  id: string
  leaderId: string
  title: string
  goal: InteractionGoal
  description: string
  strategy: string
  scheduledAt: string
  status: TaskStatus
  priority: TaskPriority
  createdAt: string
  completedAt?: string
}
