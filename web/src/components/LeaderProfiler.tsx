import { useState } from 'react'
import { ARCHETYPES, ECOSYSTEMS, matchArchetypes, type Ecosystem, type LeaderArchetype } from '@/data/archetypes'

const ECO_KEYS: Ecosystem[] = ['soe', 'private', 'mnc', 'tech']

function MeterBar({ value, max = 5, color }: { value: number; max?: number; color: string }) {
  const pct = (value / max) * 100
  return (
    <div className="meter-bar">
      <div className="fill" style={{ width: `${pct}%`, background: color }} />
    </div>
  )
}

function ProfileCard({ archetype, score }: { archetype: LeaderArchetype; score?: number }) {
  const [expanded, setExpanded] = useState(false)
  const eco = ECOSYSTEMS[archetype.ecosystem]

  return (
    <div className="card-dramatic rounded-lg p-5 animate-fade-in" style={{ animationDelay: `${archetype.id * 30}ms` }}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{archetype.emoji}</span>
          <div>
            <h3 className="font-bold text-foreground">{archetype.nameZh}</h3>
            <p className="text-xs text-muted-foreground">{archetype.nameEn}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {score !== undefined && (
            <span className="text-xs font-mono font-bold text-gradient-gold">{score}%</span>
          )}
          <span className={`ecosystem-badge ${eco.color}`}>{eco.label}</span>
        </div>
      </div>

      <p className="text-sm text-muted-foreground italic mb-4 leading-relaxed border-l-2 border-gold-dim pl-3">
        {archetype.dramaticIntro}
      </p>

      <div className="grid grid-cols-3 gap-3 mb-4">
        <div>
          <p className="text-[0.625rem] text-muted-foreground mb-1">面子敏感度</p>
          <MeterBar value={archetype.faceSensitivityLevel} color="hsl(42 92% 56%)" />
          <p className="text-[0.625rem] text-muted-foreground mt-0.5">{archetype.faceSensitivity}</p>
        </div>
        <div>
          <p className="text-[0.625rem] text-muted-foreground mb-1">AI激进度</p>
          <MeterBar value={archetype.aiAttitudeLevel} color="hsl(185 70% 42%)" />
          <p className="text-[0.625rem] text-muted-foreground mt-0.5">{archetype.aiAttitude}</p>
        </div>
        <div>
          <p className="text-[0.625rem] text-muted-foreground mb-1">程序员杠杆</p>
          <MeterBar value={archetype.programmerLeverageLevel} color={archetype.programmerLeverageLevel >= 4 ? 'hsl(142 70% 45%)' : archetype.programmerLeverageLevel >= 3 ? 'hsl(42 92% 56%)' : 'hsl(0 72% 51%)'} />
          <p className="text-[0.625rem] text-muted-foreground mt-0.5">{archetype.programmerLeverage}</p>
        </div>
      </div>

      <button
        onClick={() => setExpanded(!expanded)}
        className="text-xs text-gold-dim hover:text-primary transition-colors cursor-pointer"
      >
        {expanded ? '▲ 收起详情' : '▼ 展开完整画像'}
      </button>

      {expanded && (
        <div className="mt-4 space-y-3 animate-fade-in">
          <div className="glow-line" />
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-[0.625rem] uppercase tracking-wider text-muted-foreground mb-1">核心动机</p>
              <p className="text-foreground">{archetype.coreMotivation}</p>
            </div>
            <div>
              <p className="text-[0.625rem] uppercase tracking-wider text-muted-foreground mb-1">典型年龄</p>
              <p className="text-foreground">{archetype.ageRange[0]}-{archetype.ageRange[1]}岁</p>
            </div>
            <div>
              <p className="text-[0.625rem] uppercase tracking-wider text-muted-foreground mb-1">沟通风格</p>
              <p className="text-foreground">{archetype.communicationStyle}</p>
            </div>
            <div>
              <p className="text-[0.625rem] uppercase tracking-wider text-muted-foreground mb-1">技术态度</p>
              <p className="text-foreground">{archetype.techAttitude}</p>
            </div>
          </div>
          <div>
            <p className="text-[0.625rem] uppercase tracking-wider text-muted-foreground mb-2">弱点与盲区</p>
            <div className="flex flex-wrap gap-1.5">
              {archetype.weaknesses.map((w, i) => (
                <span key={i} className="tag-pill">{w}</span>
              ))}
            </div>
          </div>
          <div>
            <p className="text-[0.625rem] uppercase tracking-wider text-muted-foreground mb-2">管理策略</p>
            <ul className="space-y-1.5">
              {archetype.strategies.map((s, i) => (
                <li key={i} className="text-sm text-secondary-foreground flex items-start gap-2">
                  <span className="text-primary mt-0.5 shrink-0">→</span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}

export default function LeaderProfiler() {
  const [selectedEco, setSelectedEco] = useState<Ecosystem | null>(null)
  const [keywords, setKeywords] = useState('')
  const [age, setAge] = useState('')
  const [results, setResults] = useState<{ archetype: LeaderArchetype; score: number }[] | null>(null)
  const [browsing, setBrowsing] = useState(false)

  function handleMatch() {
    const kws = keywords.trim().split(/[,，\s]+/).filter(Boolean)
    const matches = matchArchetypes(
      selectedEco ?? undefined,
      kws.length > 0 ? kws : undefined,
      age ? parseInt(age) : undefined
    )
    setResults(matches)
    setBrowsing(false)
  }

  function handleBrowse(eco: Ecosystem) {
    setResults(ARCHETYPES.filter(a => a.ecosystem === eco).map(a => ({ archetype: a, score: 0 })))
    setBrowsing(true)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gradient-gold mb-1">领导画像生成器</h2>
        <p className="text-sm text-muted-foreground">描述你的领导，AI将为你匹配最接近的原型画像并提供定制化管理策略</p>
      </div>

      {/* Input Section */}
      <div className="card-dramatic rounded-lg p-5 space-y-4">
        <div>
          <label className="text-xs uppercase tracking-wider text-muted-foreground block mb-2">选择组织类型</label>
          <div className="flex flex-wrap gap-2">
            {ECO_KEYS.map(eco => (
              <button
                key={eco}
                onClick={() => setSelectedEco(selectedEco === eco ? null : eco)}
                className={`ecosystem-badge ${ECOSYSTEMS[eco].color} cursor-pointer transition-all ${
                  selectedEco === eco ? 'ring-1 ring-current scale-105' : 'opacity-70 hover:opacity-100'
                }`}
              >
                {ECOSYSTEMS[eco].label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs uppercase tracking-wider text-muted-foreground block mb-2">
            领导特征关键词 <span className="text-muted-foreground/50">（逗号或空格分隔）</span>
          </label>
          <input
            type="text"
            value={keywords}
            onChange={e => setKeywords(e.target.value)}
            placeholder="例如：处长、注重面子、不懂技术、996、CTO…"
            className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary transition-all"
          />
        </div>

        <div className="flex items-end gap-4">
          <div className="flex-1">
            <label className="text-xs uppercase tracking-wider text-muted-foreground block mb-2">领导大致年龄</label>
            <input
              type="number"
              value={age}
              onChange={e => setAge(e.target.value)}
              placeholder="例如：48"
              className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary transition-all"
            />
          </div>
          <button onClick={handleMatch} className="btn-gold whitespace-nowrap">
            ⚡ 匹配画像
          </button>
        </div>
      </div>

      {/* Quick Browse */}
      <div>
        <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">或按体系浏览全部画像</p>
        <div className="flex flex-wrap gap-2">
          {ECO_KEYS.map(eco => (
            <button key={eco} onClick={() => handleBrowse(eco)} className="btn-cyber text-xs">
              浏览{ECOSYSTEMS[eco].label}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      {results && (
        <div>
          <div className="glow-line mb-4" />
          <p className="text-sm text-muted-foreground mb-4">
            {browsing
              ? `${results[0]?.archetype.ecosystemLabel} — 共 ${results.length} 个画像`
              : `匹配到 ${results.length} 个画像，按匹配度排序`
            }
          </p>
          <div className="grid gap-4">
            {results.map(r => (
              <ProfileCard key={r.archetype.id} archetype={r.archetype} score={browsing ? undefined : r.score} />
            ))}
          </div>
          {results.length === 0 && (
            <div className="card-dramatic rounded-lg p-8 text-center">
              <p className="text-muted-foreground">未找到匹配的画像。请尝试添加更多关键词或选择组织类型。</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}