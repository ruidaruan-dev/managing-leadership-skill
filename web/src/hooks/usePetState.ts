import { useLocalStorage } from './useLocalStorage'
import type { PetState } from '@/types/pet'

const DEFAULT_PET: PetState = {
  selectedLeaderId: null,
  petNickname: '',
  totalWhips: 0,
  whipHistory: [],
  createdAt: '',
  lastInteraction: '',
}

export function usePetState() {
  const [petState, setPetState] = useLocalStorage<PetState>('ml-pet-state', DEFAULT_PET)

  const selectPet = (archetypeId: number, nickname: string) => {
    setPetState({
      selectedLeaderId: archetypeId,
      petNickname: nickname,
      totalWhips: 0,
      whipHistory: [],
      createdAt: new Date().toISOString(),
      lastInteraction: new Date().toISOString(),
    })
  }

  const recordWhip = (quote: string) => {
    setPetState(prev => ({
      ...prev,
      totalWhips: prev.totalWhips + 1,
      whipHistory: [
        { quote, timestamp: new Date().toISOString() },
        ...prev.whipHistory,
      ].slice(0, 50),
      lastInteraction: new Date().toISOString(),
    }))
  }

  const resetPet = () => setPetState(DEFAULT_PET)

  return {
    petState,
    hasPet: petState.selectedLeaderId !== null,
    selectPet,
    recordWhip,
    resetPet,
  }
}
