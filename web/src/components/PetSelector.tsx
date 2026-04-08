import { useState } from 'react'
import { ARCHETYPES } from '@/data/archetypes'
import { GRID_CATEGORIES, GRID_ROWS, GRID_COLS, GRID_LAYOUT } from '@/data/gridMapping'

export default function PetSelector({
  onSelect,
  preSelectedId,
}: {
  onSelect: (archetypeId: number, nickname: string) => void
  preSelectedId?: number | null
}) {
  const [selectedId, setSelectedId] = useState<number | null>(preSelectedId ?? null)
  const [nickname, setNickname] = useState('')

  const archetypeMap = new Map(ARCHETYPES.map(a => [a.id, a]))
  const selected = selectedId ? archetypeMap.get(selectedId) : null

  return (
    <div className="card-dramatic p-5 sm:p-8 max-w-2xl mx-auto animate-fade-in">
      <h2 className="text-xl font-bold text-gradient-gold mb-1">选择你的领导灵宠</h2>
      <p className="text-sm text-muted-foreground mb-6">点击选择一个领导类型，给他起个名字，然后开始驯化</p>

      {/* Compact 4x4 grid */}
      <div className="overflow-x-auto -mx-2 px-2 mb-6">
        <div className="grid grid-cols-4 gap-1 min-w-[360px]">
          {GRID_ROWS.flatMap(row =>
            GRID_COLS.map(eco => {
              const id = GRID_LAYOUT[row][eco]
              const arch = archetypeMap.get(id)!
              const isSelected = selectedId === id
              return (
                <button
                  key={id}
                  onClick={() => setSelectedId(id)}
                  className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[hsl(var(--gold)/0.15)] ring-2 ring-[hsl(var(--gold))] scale-105'
                      : 'hover:bg-card/80 hover:scale-102'
                  }`}
                >
                  <img
                    src={arch.portraitImage}
                    alt={arch.nameZh}
                    className={`w-12 h-12 rounded border ${isSelected ? 'border-[hsl(var(--gold))]' : 'border-border'}`}
                    loading="lazy"
                  />
                  <span className="text-[10px] leading-tight text-center">{arch.nameZh}</span>
                </button>
              )
            })
          )}
        </div>
      </div>

      {/* Selected + Nickname */}
      {selected && (
        <div className="animate-fade-in">
          <div className="flex items-center gap-3 mb-4 p-3 rounded-lg bg-card border border-border">
            <img src={selected.portraitImage} alt={selected.nameZh} className="w-14 h-14 rounded-lg border border-[hsl(var(--gold))]" />
            <div>
              <p className="font-bold text-foreground">{selected.emoji} {selected.nameZh}</p>
              <p className="text-xs text-muted-foreground">{selected.ecosystemLabel} · {GRID_CATEGORIES[selected.gridCategory].label}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <input
              type="text"
              value={nickname}
              onChange={e => setNickname(e.target.value)}
              placeholder="给灵宠起个名字（如：老王、张总）"
              className="flex-1 bg-muted border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[hsl(var(--gold))]"
              maxLength={20}
            />
            <button
              onClick={() => nickname.trim() && onSelect(selected.id, nickname.trim())}
              disabled={!nickname.trim()}
              className="btn-gold px-5 py-2 text-sm font-bold rounded-lg disabled:opacity-40 disabled:cursor-not-allowed"
            >
              开始驯化
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
