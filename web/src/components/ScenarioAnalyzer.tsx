import { useState } from 'react'
import { SCENARIOS, type Scenario } from '@/data/scenarios'
import { ARCHETYPES } from '@/data/archetypes'
import type { LeaderNode } from '@/types/network'

const RISK_COLORS: Record<string, string> = {
  low: 'hsl(142 70% 45%)',
  medium: 'hsl(42 92% 56%)',
  high: 'hsl(0 72% 51%)',
}
const RISK_LABELS: Record<string, string> = {
  low: '低风险',
  medium: '中风险',
  high: '高风险',
}

function StrategyCard({ strategy, leaderArchetype }: { strategy: Scenario['strategies'][0]; leaderArchetype?: LeaderNode & { archetypeLabel?: string; archetypeEmoji?: string } }) {
  const [showDialogue, setShowDialogue] = useState(false)

  // 根据领导类型生成个性化调整建议
  const personalizedTip = leaderArchetype?.archetypeId
    ? (() => {
        const arch = ARCHETYPES.find(a => a.id === leaderArchetype.archetypeId)
        if (!arch) return null

        const tips: string[] = []
        // 根据面子敏感度调整
        if (arch.faceSensitivityLevel >= 4) {
          tips.push('该领导面子敏感度极高，策略执行时注意私下沟通，避免公开场合触发防御')
        }
        // 根据AI态度调整
        if (arch.aiAttitudeLevel <= 2) {
          tips.push('该领导对AI持谨慎态度，避免过度强调技术先进性，聚焦业务价值')
        } else if (arch.aiAttitudeLevel >= 4) {
          tips.push('该领导对AI热情，可适当展示AI赋能的愿景和创新点')
        }
        // 根据程序员杠杆调整
        if (arch.programmerLeverageLevel >= 4) {
          tips.push('技术能力是你的核心筹码，可以用专业判断来影响决策')
        } else if (arch.programmerLeverageLevel <= 2) {
          tips.push('技术话语权较弱，需要用业务语言包装技术诉求')
        }

        return tips.length > 0 ? tips : null
      })()
    : null

  return (
    <div className={`card-dramatic rounded-lg p-4 space-y-3 ${leaderArchetype ? 'border-l-2 border-l-[hsl(var(--gold))]' : ''}`}>
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-foreground">
          {leaderArchetype && <span className="mr-1.5 text-[hsl(var(--gold))]">{leaderArchetype.archetypeEmoji}</span>}
          {strategy.name}
        </h4>
        <span className="tag-pill" style={{ borderColor: strategy.risk.includes('低') ? RISK_COLORS.low : strategy.risk.includes('高') ? RISK_COLORS.high : RISK_COLORS.medium }}>
          {strategy.risk}
        </span>
      </div>
      <p className="text-sm text-muted-foreground">{strategy.description}</p>

      {/* 个性化调整建议 */}
      {personalizedTip && personalizedTip.length > 0 && (
        <div className="bg-[hsl(var(--gold)/0.05)] border border-[hsl(var(--gold)/0.3)] rounded-md p-3 space-y-1.5 animate-fade-in">
          <p className="text-[10px] font-bold text-[hsl(var(--gold))] uppercase tracking-wider">🎯 针对{leaderArchetype?.name}的调整建议</p>
          {personalizedTip.map((tip, i) => (
            <p key={i} className="text-xs text-foreground leading-relaxed">• {tip}</p>
          ))}
        </div>
      )}

      <button
        onClick={() => setShowDialogue(!showDialogue)}
        className="text-xs text-cyber hover:text-accent transition-colors cursor-pointer"
      >
        {showDialogue ? '▲ 收起话术' : '💬 查看参考话术'}
      </button>
      {showDialogue && (
        <div className="animate-fade-in bg-background/50 rounded-md p-3 border border-border">
          <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">{strategy.dialogue}</p>
        </div>
      )}
    </div>
  )
}

export default function ScenarioAnalyzer({ leaders }: { leaders?: LeaderNode[] }) {
  const [selected, setSelected] = useState<Scenario | null>(null)
  const [selectedLeaderId, setSelectedLeaderId] = useState<string>('')

  const selectedLeader = leaders?.find(l => l.id === selectedLeaderId)
  const selectedLeaderArchetype = selectedLeader?.archetypeId ? ARCHETYPES.find(a => a.id === selectedLeader.archetypeId) : null

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gradient-cyber mb-1">场景分析器</h2>
        <p className="text-sm text-muted-foreground">选择一个职场困境，获取多维度策略建议和参考话术</p>
      </div>

      {/* Scenario Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {SCENARIOS.map(scenario => (
          <div
            key={scenario.id}
            onClick={() => setSelected(selected?.id === scenario.id ? null : scenario)}
            className={`scenario-card ${selected?.id === scenario.id ? 'active' : ''}`}
          >
            <div className="flex items-start gap-3">
              <span className="text-xl shrink-0">{scenario.icon}</span>
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-foreground text-sm truncate">{scenario.title}</h3>
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ background: RISK_COLORS[scenario.riskLevel] }}
                    title={RISK_LABELS[scenario.riskLevel]}
                  />
                </div>
                <p className="text-xs text-muted-foreground">{scenario.subtitle}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Selected Scenario Detail */}
      {selected && (
        <div className="animate-slide-up space-y-5">
          <div className="glow-line" />

          <div className="card-dramatic rounded-lg p-5 space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">{selected.icon}</span>
              <div>
                <h3 className="text-xl font-bold text-foreground">{selected.title}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="tag-pill">{selected.subtitle}</span>
                  <span className="tag-pill" style={{ borderColor: RISK_COLORS[selected.riskLevel], color: RISK_COLORS[selected.riskLevel] }}>
                    风险等级：{RISK_LABELS[selected.riskLevel]}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <p className="text-[0.625rem] uppercase tracking-wider text-muted-foreground mb-1">场景描述</p>
              <p className="text-sm text-foreground leading-relaxed">{selected.description}</p>
            </div>

            <div>
              <p className="text-[0.625rem] uppercase tracking-wider text-muted-foreground mb-1">利益相关者</p>
              <p className="text-sm text-secondary-foreground">{selected.stakeholders}</p>
            </div>
          </div>

          {/* 选择已建档的领导，个性化策略 */}
          {leaders && leaders.length > 0 && (
            <div className="card-dramatic rounded-lg p-4 border border-[hsl(var(--gold)/0.3)]">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-semibold text-[hsl(var(--gold))] uppercase tracking-wider">🎯 结合我的领导调整策略</p>
                {selectedLeaderId && (
                  <button
                    onClick={() => setSelectedLeaderId('')}
                    className="text-[10px] text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                  >
                    ✕ 清除选择
                  </button>
                )}
              </div>
              <select
                value={selectedLeaderId}
                onChange={e => setSelectedLeaderId(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-background border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-[hsl(var(--gold))]"
              >
                <option value="">— 选择一个已建档的领导 —</option>
                {leaders
                  .filter(l => l.archetypeId) // 只显示匹配了原型的领导
                  .map(l => {
                    const arch = ARCHETYPES.find(a => a.id === l.archetypeId)
                    return (
                      <option key={l.id} value={l.id}>
                        {arch?.emoji} {l.name} · {arch?.nameZh || '未指定原型'} · {l.title}
                      </option>
                    )
                  })}
              </select>
              {selectedLeaderId && (
                <p className="text-[10px] text-muted-foreground mt-2">
                  💡 选择后，策略选项将根据该领导的面子敏感度、AI态度、技术话语权等维度自动调整建议
                </p>
              )}
            </div>
          )}

          <div>
            <h4 className="text-sm font-semibold text-foreground mb-3">
              策略选项
              {selectedLeader && selectedLeaderArchetype && (
                <span className="ml-2 text-xs font-normal text-[hsl(var(--gold))]">
                  — 已结合 {selectedLeaderArchetype.emoji} {selectedLeader.name} 调整
                </span>
              )}
            </h4>
            <div className="grid gap-3">
              {selected.strategies.map((s, i) => (
                <StrategyCard
                  key={i}
                  strategy={s}
                  leaderArchetype={selectedLeader && selectedLeaderArchetype ? {
                    ...selectedLeader,
                    archetypeLabel: selectedLeaderArchetype.nameZh,
                    archetypeEmoji: selectedLeaderArchetype.emoji,
                  } : undefined}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}