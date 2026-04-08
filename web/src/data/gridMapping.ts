import type { GridCategory, GridCategoryInfo } from '@/types/pet'
import type { Ecosystem } from './archetypes'

export const GRID_CATEGORIES: Record<GridCategory, GridCategoryInfo> = {
  power: {
    label: '掌权者',
    labelEn: 'Power Holders',
    icon: '👑',
    description: '主动攫取并掌控实权的领导者',
  },
  system: {
    label: '体制人',
    labelEn: 'System Players',
    icon: '🏛️',
    description: '精通体系规则、以规则为武器的领导者',
  },
  crosser: {
    label: '跨界者',
    labelEn: 'Boundary Crossers',
    icon: '🌉',
    description: '跨越身份边界、在新语境中证明自己的领导者',
  },
  wildcard: {
    label: '异类者',
    labelEn: 'Wildcards',
    icon: '🃏',
    description: '打破常规模式的极端型领导者',
  },
}

export const GRID_ROWS: GridCategory[] = ['power', 'system', 'crosser', 'wildcard']
export const GRID_COLS: Ecosystem[] = ['soe', 'private', 'mnc', 'tech']

// [row][col] → archetype id
export const GRID_LAYOUT: Record<GridCategory, Record<Ecosystem, number>> = {
  power:    { soe: 3,  private: 5,  mnc: 11, tech: 13 },
  system:   { soe: 1,  private: 6,  mnc: 12, tech: 14 },
  crosser:  { soe: 2,  private: 7,  mnc: 9,  tech: 15 },
  wildcard: { soe: 4,  private: 8,  mnc: 10, tech: 16 },
}
