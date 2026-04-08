import { useState } from 'react'
import { SCENARIOS, type Scenario } from '@/data/scenarios'

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

function StrategyCard({ strategy }: { strategy: Scenario['strategies'][0] }) {
  const [showDialogue, setShowDialogue] = useState(false)

  return (
    <div className="card-dramatic rounded-lg p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-foreground">{strategy.name}</h4>
        <span className="tag-pill" style={{ borderColor: strategy.risk.includes('低') ? RISK_COLORS.low : strategy.risk.includes('高') ? RISK_COLORS.high : RISK_COLORS.medium }}>
          {strategy.risk}
        </span>
      </div>
      <p className="text-sm text-muted-foreground">{strategy.description}</p>
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

export default function ScenarioAnalyzer() {
  const [selected, setSelected] = useState<Scenario | null>(null)

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

          <div>
            <h4 className="text-sm font-semibold text-foreground mb-3">策略选项</h4>
            <div className="grid gap-3">
              {selected.strategies.map((s, i) => (
                <StrategyCard key={i} strategy={s} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}