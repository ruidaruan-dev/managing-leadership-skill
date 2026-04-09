import { ARCHETYPES, ECOSYSTEMS, type LeaderArchetype } from '@/data/archetypes'
import { GRID_CATEGORIES, GRID_ROWS, GRID_COLS, GRID_LAYOUT } from '@/data/gridMapping'
import { useState } from 'react'

function MeterBar({ value, max = 5, color = 'gold' }: { value: number; max?: number; color?: string }) {
  const pct = (value / max) * 100
  const bg = color === 'gold' ? 'bg-[hsl(var(--gold))]'
    : color === 'cyan' ? 'bg-[hsl(var(--cyber))]'
    : value >= 4 ? 'bg-green-500' : value >= 2 ? 'bg-yellow-500' : 'bg-red-500'
  return (
    <div className="meter-bar">
      <div className={`meter-bar-fill ${bg}`} style={{ width: `${pct}%` }} />
    </div>
  )
}

function GridCell({ archetype, onClick }: { archetype: LeaderArchetype; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="group flex flex-col items-center gap-1.5 p-2 rounded-lg cursor-pointer transition-all duration-300 hover:scale-105 hover:bg-card/80 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--gold))]"
    >
      <div className="relative w-[72px] h-[72px] sm:w-20 sm:h-20 rounded-lg overflow-hidden border-2 border-border group-hover:border-[hsl(var(--gold))] group-hover:shadow-[0_0_12px_hsl(var(--gold)/0.4)] transition-all duration-300">
        <img
          src={archetype.portraitImage}
          alt={archetype.nameZh}
          className="w-full h-full object-cover"
          style={{ imageRendering: 'auto' }}
          loading="lazy"
        />
      </div>
      <span className="text-[11px] sm:text-xs font-medium text-center leading-tight text-muted-foreground group-hover:text-foreground transition-colors">
        {archetype.nameZh}
      </span>
    </button>
  )
}

function ArchetypeDetailModal({
  archetype,
  onClose,
  onTame,
  onCreateProfile,
}: {
  archetype: LeaderArchetype
  onClose: () => void
  onTame: (id: number) => void
  onCreateProfile?: (id: number) => void
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-lg max-h-[85vh] overflow-y-auto bg-card border border-border rounded-t-2xl sm:rounded-2xl p-5 animate-slide-up"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start gap-4 mb-4">
          <img
            src={archetype.portraitImage}
            alt={archetype.nameZh}
            className="w-20 h-20 rounded-lg border-2 border-[hsl(var(--gold))] shadow-[0_0_12px_hsl(var(--gold)/0.3)]"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg">{archetype.emoji}</span>
              <h3 className="text-lg font-bold text-foreground">{archetype.nameZh}</h3>
            </div>
            <p className="text-xs text-muted-foreground mb-1">{archetype.nameEn}</p>
            <span className={`ecosystem-badge ${archetype.ecosystem}`}>{archetype.ecosystemLabel}</span>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground text-xl leading-none cursor-pointer">&times;</button>
        </div>

        {/* Dramatic Intro */}
        <p className="text-sm text-secondary-foreground italic border-l-2 border-[hsl(var(--gold))] pl-3 mb-4">{archetype.dramaticIntro}</p>

        {/* Meters */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">面子敏感度</span>
            <MeterBar value={archetype.faceSensitivityLevel} color="gold" />
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">AI激进度</span>
            <MeterBar value={archetype.aiAttitudeLevel} color="cyan" />
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">程序员杠杆</span>
            <MeterBar value={archetype.programmerLeverageLevel} color="dynamic" />
          </div>
        </div>

        {/* Details */}
        <div className="space-y-3 text-sm">
          <div><span className="text-[hsl(var(--gold))] font-semibold">核心动机：</span><span className="text-foreground">{archetype.coreMotivation}</span></div>
          <div><span className="text-[hsl(var(--gold))] font-semibold">沟通风格：</span><span className="text-foreground">{archetype.communicationStyle}</span></div>
          <div><span className="text-[hsl(var(--gold))] font-semibold">技术态度：</span><span className="text-foreground">{archetype.techAttitude}</span></div>
          <div>
            <span className="text-[hsl(var(--gold))] font-semibold">弱点与盲区：</span>
            <ul className="list-disc list-inside text-foreground mt-1">
              {archetype.weaknesses.map((w, i) => <li key={i}>{w}</li>)}
            </ul>
          </div>
          <div>
            <span className="text-[hsl(var(--gold))] font-semibold">管理策略：</span>
            <ul className="list-disc list-inside text-foreground mt-1">
              {archetype.strategies.map((s, i) => <li key={i}>{s}</li>)}
            </ul>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2 mt-5">
          {onCreateProfile && (
            <button
              onClick={() => onCreateProfile(archetype.id)}
              className="w-full py-2.5 text-sm font-bold rounded-lg border-2 border-[hsl(var(--cyber))] text-[hsl(var(--cyber))] hover:bg-[hsl(var(--cyber)/0.1)] transition-colors cursor-pointer"
            >
              📂 我有这种领导 — 给TA建立关系档案
            </button>
          )}
          <button
            onClick={() => onTame(archetype.id)}
            className="btn-gold w-full py-2.5 text-sm font-bold rounded-lg"
          >
            🐾 养他 — 把这个领导变成你的灵宠
          </button>
        </div>
      </div>
    </div>
  )
}

export default function LeaderProfiler({ onNavigateToPet, onNavigateToNetwork }: { onNavigateToPet?: (id: number) => void; onNavigateToNetwork?: (id: number) => void }) {
  const [selectedArchetype, setSelectedArchetype] = useState<LeaderArchetype | null>(null)

  const archetypeMap = new Map(ARCHETYPES.map(a => [a.id, a]))

  return (
    <div>
      {/* 4x4 Grid */}
      <div className="card-dramatic p-4 sm:p-6 mb-6">
        <h2 className="text-lg font-bold text-gradient-gold mb-1">领导原型矩阵</h2>
        <p className="text-xs text-muted-foreground mb-4">4大组织生态 × 4类行为模式 = 16种领导画像，点击查看详情</p>

        <div className="overflow-x-auto -mx-2 px-2">
          <table className="w-full border-collapse min-w-[480px]">
            <thead>
              <tr>
                <th className="w-20 p-1" />
                {GRID_COLS.map(eco => (
                  <th key={eco} className="p-1 text-center">
                    <span className={`ecosystem-badge ${eco} text-[10px] sm:text-xs`}>
                      {ECOSYSTEMS[eco].label}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {GRID_ROWS.map(row => (
                <tr key={row}>
                  <td className="p-1 align-middle">
                    <div className="flex flex-col items-center gap-0.5">
                      <span className="text-base">{GRID_CATEGORIES[row].icon}</span>
                      <span className="text-[10px] sm:text-xs font-semibold text-[hsl(var(--gold))]">{GRID_CATEGORIES[row].label}</span>
                    </div>
                  </td>
                  {GRID_COLS.map(eco => {
                    const id = GRID_LAYOUT[row][eco]
                    const arch = archetypeMap.get(id)!
                    return (
                      <td key={eco} className="p-0.5 text-center">
                        <GridCell archetype={arch} onClick={() => setSelectedArchetype(arch)} />
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedArchetype && (
        <ArchetypeDetailModal
          archetype={selectedArchetype}
          onClose={() => setSelectedArchetype(null)}
          onTame={(id) => {
            setSelectedArchetype(null)
            onNavigateToPet?.(id)
          }}
          onCreateProfile={(id) => {
            setSelectedArchetype(null)
            onNavigateToNetwork?.(id)
          }}
        />
      )}
    </div>
  )
}
