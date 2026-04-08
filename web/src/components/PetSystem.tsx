import { usePetState } from '@/hooks/usePetState'
import PetSelector from './PetSelector'
import WhipGame from './WhipGame'
import TacticalReminders from './TacticalReminders'

export default function PetSystem({ preSelectedId }: { preSelectedId?: number | null }) {
  const { petState, hasPet, selectPet, recordWhip, resetPet } = usePetState()

  if (!hasPet) {
    return (
      <PetSelector
        preSelectedId={preSelectedId}
        onSelect={selectPet}
      />
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Reset option */}
      <div className="flex justify-end">
        <button
          onClick={() => {
            if (confirm('确定要释放这只灵宠吗？所有鞭打记录将清空。')) {
              resetPet()
            }
          }}
          className="text-xs text-muted-foreground hover:text-red-400 transition-colors cursor-pointer"
        >
          释放灵宠
        </button>
      </div>

      {/* Whip Game */}
      <WhipGame
        leaderId={petState.selectedLeaderId!}
        petNickname={petState.petNickname}
        totalWhips={petState.totalWhips}
        onWhip={recordWhip}
      />

      {/* Tactical Reminders */}
      <TacticalReminders leaderId={petState.selectedLeaderId!} />
    </div>
  )
}
