import { useState, useMemo, useEffect } from 'react'
import { useLeaderNetwork } from '@/hooks/useLeaderNetwork'
import { ARCHETYPES } from '@/data/archetypes'
import type { LeaderNode, InteractionTask, RelationshipLevel, InteractionGoal, TaskPriority, InteractionOutcome } from '@/types/network'

// ─── 预设模板 ────────────────────────────────────────────────────────────────

interface LeaderPreset {
  id: string
  label: string
  icon: string
  description: string
  data: Partial<LeaderNode>
}

const LEADER_PRESETS: LeaderPreset[] = [
  {
    id: 'direct-manager',
    label: '直属领导',
    icon: '👔',
    description: '直接汇报的上级主管',
    data: {
      title: '部门经理',
      relationshipLevel: 'normal',
      personalityNotes: '',
      behaviorPatterns: '关注工作进度和结果，定期需要工作汇报',
      preferences: '喜欢简洁明了的汇报，偏好数据支撑的结论',
      avoidances: '不喜欢被突袭提问，避免在公开场合质疑决定',
    },
  },
  {
    id: 'dept-head',
    label: '部门负责人',
    icon: '🏢',
    description: '跨级的高层领导',
    data: {
      title: '总监/VP',
      relationshipLevel: 'cautious',
      personalityNotes: '',
      behaviorPatterns: '关注战略和大方向，较少关注执行细节',
      preferences: '喜欢一页纸摘要，重视业务价值和ROI',
      avoidances: '避免过多技术细节，不要在会议中挑战其权威',
    },
  },
  {
    id: 'cross-dept',
    label: '跨部门协作者',
    icon: '🤝',
    description: '需要协作的其他部门领导',
    data: {
      title: '部门经理',
      relationshipLevel: 'normal',
      personalityNotes: '',
      behaviorPatterns: '有自己的KPI压力，资源分配需要协商',
      preferences: '喜欢互利共赢的合作模式，重视沟通效率',
      avoidances: '避免越级汇报，不要在其团队面前指责',
    },
  },
  {
    id: 'tech-lead',
    label: '技术型领导',
    icon: '💻',
    description: '技术出身转管理的领导',
    data: {
      title: '技术总监/架构师',
      archetypeId: null,
      relationshipLevel: 'normal',
      personalityNotes: '技术背景深厚，对新技术保持关注',
      behaviorPatterns: '喜欢深入技术细节，偶尔会参与代码评审',
      preferences: '喜欢技术讨论，欣赏主动学习新技术的下属',
      avoidances: '不要质疑其技术判断，避免使用过时的技术方案',
    },
  },
  {
    id: 'project-sponsor',
    label: '项目赞助人',
    icon: '💰',
    description: '为你提供资源和支持的领导',
    data: {
      title: '高级经理/总监',
      relationshipLevel: 'close',
      personalityNotes: '',
      behaviorPatterns: '关注项目进展和投资回报，定期要看到成果',
      preferences: '喜欢阶段性成果展示，重视风险提前预警',
      avoidances: '不要隐瞒问题，避免超出预算的惊喜',
    },
  },
  {
    id: 'matrix-boss',
    label: '虚线汇报领导',
    icon: '🔀',
    description: '矩阵式管理中的另一位领导',
    data: {
      title: '项目经理/产品负责人',
      relationshipLevel: 'cautious',
      personalityNotes: '',
      behaviorPatterns: '需要平衡多方利益，决策周期可能较长',
      preferences: '喜欢主动沟通进展，重视跨团队协作',
      avoidances: '避免让其在实线领导面前难堪，注意汇报优先级',
    },
  },
]

// ─── Constants ────────────────────────────────────────────────────────────────

const REL_LEVEL_CONFIG: Record<RelationshipLevel, { label: string; color: string; dot: string }> = {
  close:    { label: '亲密盟友', color: 'text-emerald-400', dot: 'bg-emerald-400' },
  normal:   { label: '正常同事', color: 'text-[hsl(var(--cyber))]', dot: 'bg-[hsl(var(--cyber))]' },
  cautious: { label: '谨慎相处', color: 'text-amber-400', dot: 'bg-amber-400' },
  tense:    { label: '关系紧张', color: 'text-red-400', dot: 'bg-red-400' },
}

const GOAL_CONFIG: Record<InteractionGoal, { label: string; icon: string }> = {
  align:     { label: '对齐目标', icon: '🎯' },
  report:    { label: '汇报进展', icon: '📊' },
  request:   { label: '申请资源', icon: '🙏' },
  build:     { label: '关系建设', icon: '🤝' },
  repair:    { label: '修复关系', icon: '🔧' },
  negotiate: { label: '谈判协商', icon: '⚖️' },
}

const PRIORITY_CONFIG: Record<TaskPriority, { label: string; color: string }> = {
  high:   { label: '紧急', color: 'text-red-400 border-red-400/40 bg-red-400/10' },
  medium: { label: '重要', color: 'text-amber-400 border-amber-400/40 bg-amber-400/10' },
  low:    { label: '普通', color: 'text-muted-foreground border-border bg-muted/30' },
}

// 互动目标 → 沟通起草场景映射
const GOAL_TO_COMM_SCENARIO: Record<InteractionGoal, string | null> = {
  align:     null,       // 对齐目标 → 无直接对应
  report:    'delay',    // 汇报进展 → 汇报项目延期
  request:   'resource', // 申请资源 → 争取资源/HC
  build:     'onboard',  // 关系建设 → 自我介绍（最近）
  repair:    'bad-news', // 修复关系 → 传递坏消息（道歉场景）
  negotiate: 'pushback', // 谈判协商 → 推回不合理需求
}

const STRATEGY_SUGGESTIONS: Record<InteractionGoal, string[]> = {
  align:     ['先询问领导对项目的核心关切，再表达自己的目标', '用他的语言和优先级重新表述你的诉求', '提前准备2-3个可选方案，让他有选择感'],
  report:    ['以影响和结论开头，细节按需展开', '准备一句话摘要，以防只有30秒汇报时间', '提前预判他会问的3个问题并备好答案'],
  request:   ['将资源需求包装为对他核心目标的支持', '准备ROI数据，量化不批准的代价', '给出最小可行版本，降低他的决策阻力'],
  build:     ['找一个他关心的业务痛点，主动帮忙解决', '会议后发送一条认可或感谢信息', '记住并在合适时机提及他分享过的个人信息'],
  repair:    ['选择私下场合，避免公开对抗触发防御反应', '主动承认自己在这件事中的部分责任', '聚焦未来共同利益，而非追责过去'],
  negotiate: ['先锚定高目标，为让步留空间', '将立场分歧转化为共同需要解决的问题', '提前明确自己的底线和退出条件'],
}

// ─── Utility ──────────────────────────────────────────────────────────────────

function formatDate(iso: string) {
  const d = new Date(iso)
  const now = new Date()
  const diff = d.getTime() - now.getTime()
  const days = Math.ceil(diff / 86400000)
  if (days < 0) return `已逾期 ${Math.abs(days)} 天`
  if (days === 0) return '今天'
  if (days === 1) return '明天'
  if (days <= 7) return `${days} 天后`
  return `${d.getMonth() + 1}/${d.getDate()}`
}

function formatDateInput(iso?: string) {
  if (!iso) return ''
  const d = new Date(iso)
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset())
  return d.toISOString().slice(0, 16)
}

function EmptyState({ icon, title, desc }: { icon: string; title: string; desc: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <span className="text-5xl mb-4">{icon}</span>
      <p className="text-base font-semibold text-foreground mb-1">{title}</p>
      <p className="text-sm text-muted-foreground">{desc}</p>
    </div>
  )
}

// ─── Task Outcome Modal ───────────────────────────────────────────────────────

const OUTCOME_CONFIG: Record<InteractionOutcome, { label: string; emoji: string; color: string }> = {
  excellent: { label: '非常顺利', emoji: '🎉', color: 'text-emerald-400 border-emerald-400 bg-emerald-400/10' },
  good: { label: '比较顺利', emoji: '👍', color: 'text-[hsl(var(--cyber))] border-[hsl(var(--cyber))] bg-[hsl(var(--cyber))/0.1]' },
  average: { label: '一般般', emoji: '😐', color: 'text-amber-400 border-amber-400 bg-amber-400/10' },
  poor: { label: '不太顺利', emoji: '😰', color: 'text-red-400 border-red-400 bg-red-400/10' },
}

function TaskOutcomeModal({
  taskTitle,
  onSubmit,
  onClose,
}: {
  taskTitle: string
  onSubmit: (data: { outcome: InteractionOutcome; actualResult: string; lessonsLearned: string }) => void
  onClose: () => void
}) {
  const [form, setForm] = useState({
    outcome: 'good' as InteractionOutcome,
    actualResult: '',
    lessonsLearned: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(form)
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-card border border-border rounded-t-2xl sm:rounded-2xl p-5 animate-slide-up"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-foreground">📝 记录互动结果</h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground text-xl cursor-pointer">&times;</button>
        </div>

        <p className="text-sm text-muted-foreground mb-4">任务：<span className="text-foreground font-medium">{taskTitle}</span></p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 效果评估 */}
          <div>
            <p className="text-xs font-semibold text-[hsl(var(--gold))] mb-2 uppercase tracking-wider">这次互动效果如何？</p>
            <div className="grid grid-cols-2 gap-2">
              {(Object.entries(OUTCOME_CONFIG) as [InteractionOutcome, typeof OUTCOME_CONFIG[InteractionOutcome]][]).map(([key, val]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setForm(f => ({ ...f, outcome: key }))}
                  className={`p-3 rounded-lg border text-sm transition-all cursor-pointer ${
                    form.outcome === key
                      ? `${val.color} border-2`
                      : 'border-border hover:border-border/80'
                  }`}
                >
                  <span className="text-lg mr-1">{val.emoji}</span>
                  <span>{val.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 实际发生了什么 */}
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">实际发生了什么？（选填）</label>
            <textarea
              value={form.actualResult}
              onChange={e => setForm(f => ({ ...f, actualResult: e.target.value }))}
              rows={3}
              placeholder="领导当场同意了，但要求补充详细方案..."
              className="input-field w-full resize-none"
            />
          </div>

          {/* 学到的规律 */}
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">你学到了什么规律？（选填）</label>
            <textarea
              value={form.lessonsLearned}
              onChange={e => setForm(f => ({ ...f, lessonsLearned: e.target.value }))}
              rows={2}
              placeholder="张总喜欢先看结论，细节他会在后面问..."
              className="input-field w-full resize-none"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit" className="btn-gold flex-1 py-2.5 rounded-lg text-sm font-bold">
              ✅ 保存记录
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-lg text-sm border border-border text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              跳过
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function InfoBlock({ icon, label, content, color = 'text-[hsl(var(--gold))]' }: {
  icon: string; label: string; content: string; color?: string
}) {
  return (
    <div className="p-3 rounded-lg bg-muted/30 border border-border">
      <p className={`text-[10px] font-semibold uppercase tracking-wider mb-1.5 ${color}`}>
        {icon} {label}
      </p>
      <p className="text-xs text-foreground leading-relaxed whitespace-pre-wrap">{content}</p>
    </div>
  )
}

// ─── LeaderForm ───────────────────────────────────────────────────────────────

function LeaderForm({
  initial,
  onSubmit,
  onCancel,
  onPresetSelect,
}: {
  initial?: Partial<LeaderNode>
  onSubmit: (data: Omit<LeaderNode, 'id' | 'createdAt' | 'updatedAt'>) => void
  onCancel: () => void
  onPresetSelect?: (preset: LeaderPreset) => void
}) {
  const [form, setForm] = useState({
    name: initial?.name ?? '',
    title: initial?.title ?? '',
    department: initial?.department ?? '',
    archetypeId: initial?.archetypeId ?? null as number | null,
    relationshipLevel: (initial?.relationshipLevel ?? 'normal') as RelationshipLevel,
    personalityNotes: initial?.personalityNotes ?? '',
    behaviorPatterns: initial?.behaviorPatterns ?? '',
    preferences: initial?.preferences ?? '',
    avoidances: initial?.avoidances ?? '',
    customTraits: initial?.customTraits ?? [],
  })

  const set = (k: string, v: unknown) => setForm(f => ({ ...f, [k]: v }))

  const handlePresetClick = (preset: LeaderPreset) => {
    // 合并预设数据到表单
    setForm(f => ({
      ...f,
      title: preset.data.title ?? f.title,
      relationshipLevel: preset.data.relationshipLevel ?? f.relationshipLevel,
      personalityNotes: preset.data.personalityNotes ?? f.personalityNotes,
      behaviorPatterns: preset.data.behaviorPatterns ?? f.behaviorPatterns,
      preferences: preset.data.preferences ?? f.preferences,
      avoidances: preset.data.avoidances ?? f.avoidances,
    }))
    onPresetSelect?.(preset)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim()) return
    onSubmit(form)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* 预设模板选择区 */}
      {!initial?.name && (
        <div className="mb-4">
          <p className="text-xs font-semibold text-[hsl(var(--gold))] mb-2 uppercase tracking-wider">⚡ 快速创建 — 选择预设模板</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {LEADER_PRESETS.map(preset => (
              <button
                key={preset.id}
                type="button"
                onClick={() => handlePresetClick(preset)}
                className="group flex flex-col items-start gap-1 p-3 rounded-lg border border-border bg-muted/30 hover:border-[hsl(var(--gold))] hover:bg-[hsl(var(--gold)/0.05)] transition-all cursor-pointer text-left"
              >
                <div className="flex items-center gap-1.5">
                  <span className="text-lg">{preset.icon}</span>
                  <span className="text-xs font-medium text-foreground group-hover:text-[hsl(var(--gold))] transition-colors">{preset.label}</span>
                </div>
                <p className="text-[10px] text-muted-foreground leading-tight">{preset.description}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 分割线 */}
      {!initial?.name && (
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-border" />
          <span className="text-[10px] text-muted-foreground uppercase tracking-wider">或手动填写</span>
          <div className="flex-1 h-px bg-border" />
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">姓名 *</label>
          <input value={form.name} onChange={e => set('name', e.target.value)} required
            placeholder="张总" className="input-field w-full" />
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">职位</label>
          <input value={form.title} onChange={e => set('title', e.target.value)}
            placeholder="技术总监" className="input-field w-full" />
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">部门</label>
          <input value={form.department} onChange={e => set('department', e.target.value)}
            placeholder="研发中心" className="input-field w-full" />
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">关系状态</label>
          <select value={form.relationshipLevel}
            onChange={e => set('relationshipLevel', e.target.value as RelationshipLevel)}
            className="input-field w-full">
            {(Object.entries(REL_LEVEL_CONFIG) as [RelationshipLevel, { label: string; color: string; dot: string }][]).map(([k, v]) => (
              <option key={k} value={k}>{v.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="text-xs text-muted-foreground mb-1 block">匹配原型（选填）</label>
        <select value={form.archetypeId ?? ''}
          onChange={e => set('archetypeId', e.target.value ? Number(e.target.value) : null)}
          className="input-field w-full">
          <option value="">— 不指定原型 —</option>
          {ARCHETYPES.map(a => (
            <option key={a.id} value={a.id}>{a.emoji} {a.nameZh} · {a.ecosystemLabel}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-xs text-muted-foreground mb-1 block">性格特征 / 背景描述</label>
        <textarea value={form.personalityNotes}
          onChange={e => set('personalityNotes', e.target.value)} rows={2}
          placeholder="技术出身，40多岁，喜欢在开会时展示AI见解，面子敏感度较高…"
          className="input-field w-full resize-none" />
      </div>

      <div>
        <label className="text-xs text-muted-foreground mb-1 block">行为模式 / 决策风格</label>
        <textarea value={form.behaviorPatterns}
          onChange={e => set('behaviorPatterns', e.target.value)} rows={2}
          placeholder="喜欢看数据，开会前先问结论，不喜欢被突袭提问…"
          className="input-field w-full resize-none" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">✅ 偏好 / 喜好</label>
          <textarea value={form.preferences}
            onChange={e => set('preferences', e.target.value)} rows={2}
            placeholder="喜欢简洁的一页纸汇报，喜欢听到主动承担…"
            className="input-field w-full resize-none" />
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">⛔ 禁忌 / 规避事项</label>
          <textarea value={form.avoidances}
            onChange={e => set('avoidances', e.target.value)} rows={2}
            placeholder="不喜欢被公开质疑，避免提及上一任团队…"
            className="input-field w-full resize-none" />
        </div>
      </div>

      <div className="flex gap-3 pt-1">
        <button type="submit" className="btn-gold flex-1 py-2.5 rounded-lg text-sm font-bold">
          {initial?.name ? '💾 保存修改' : '+ 建立档案'}
        </button>
        <button type="button" onClick={onCancel}
          className="flex-1 py-2.5 rounded-lg text-sm border border-border text-muted-foreground hover:text-foreground hover:border-[hsl(var(--gold))] transition-colors cursor-pointer">
          取消
        </button>
      </div>
    </form>
  )
}

// ─── TaskForm ─────────────────────────────────────────────────────────────────

function TaskForm({
  leaderId,
  initial,
  onSubmit,
  onCancel,
}: {
  leaderId: string
  initial?: Partial<InteractionTask>
  onSubmit: (data: Omit<InteractionTask, 'id' | 'createdAt'>) => void
  onCancel: () => void
}) {
  const defaultDate = formatDateInput(initial?.scheduledAt || new Date(Date.now() + 86400000).toISOString())
  const [form, setForm] = useState({
    title: initial?.title ?? '',
    goal: (initial?.goal ?? 'report') as InteractionGoal,
    description: initial?.description ?? '',
    strategy: initial?.strategy ?? '',
    scheduledAt: defaultDate,
    priority: (initial?.priority ?? 'medium') as TaskPriority,
    status: (initial?.status ?? 'pending') as 'pending' | 'done' | 'cancelled',
  })

  const set = (k: string, v: unknown) => setForm(f => ({ ...f, [k]: v }))

  const autoFillStrategy = () => {
    const suggestions = STRATEGY_SUGGESTIONS[form.goal]
    set('strategy', suggestions.map((s, i) => `${i + 1}. ${s}`).join('\n'))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title.trim()) return
    onSubmit({
      ...form,
      leaderId,
      scheduledAt: new Date(form.scheduledAt).toISOString(),
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">任务标题 *</label>
          <input value={form.title} onChange={e => set('title', e.target.value)} required
            placeholder="Q2项目资源申请" className="input-field w-full" />
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">互动目标</label>
          <select value={form.goal} onChange={e => set('goal', e.target.value as InteractionGoal)}
            className="input-field w-full">
            {(Object.entries(GOAL_CONFIG) as [InteractionGoal, { label: string; icon: string }][]).map(([k, v]) => (
              <option key={k} value={k}>{v.icon} {v.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">计划时间</label>
          <input type="datetime-local" value={form.scheduledAt}
            onChange={e => set('scheduledAt', e.target.value)} className="input-field w-full" />
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">优先级</label>
          <select value={form.priority} onChange={e => set('priority', e.target.value as TaskPriority)}
            className="input-field w-full">
            <option value="high">🔴 紧急</option>
            <option value="medium">🟡 重要</option>
            <option value="low">⚪ 普通</option>
          </select>
        </div>
      </div>

      <div>
        <label className="text-xs text-muted-foreground mb-1 block">具体内容描述</label>
        <textarea value={form.description} onChange={e => set('description', e.target.value)} rows={2}
          placeholder="申请3名额外开发资源支持AI流程自动化项目第二阶段…"
          className="input-field w-full resize-none" />
      </div>

      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="text-xs text-muted-foreground">行动策略要点</label>
          <button type="button" onClick={autoFillStrategy}
            className="text-[10px] text-[hsl(var(--cyber))] hover:text-[hsl(var(--gold))] transition-colors cursor-pointer">
            ✨ 智能建议策略
          </button>
        </div>
        <textarea value={form.strategy} onChange={e => set('strategy', e.target.value)} rows={3}
          placeholder="点击「智能建议策略」自动生成，或手动输入你的应对思路…"
          className="input-field w-full resize-none" />
      </div>

      <div className="flex gap-3 pt-1">
        <button type="submit" className="btn-gold flex-1 py-2.5 rounded-lg text-sm font-bold">
          {initial?.title ? '💾 保存任务' : '+ 加入看板'}
        </button>
        <button type="button" onClick={onCancel}
          className="flex-1 py-2.5 rounded-lg text-sm border border-border text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
          取消
        </button>
      </div>
    </form>
  )
}

// ─── TaskCard ─────────────────────────────────────────────────────────────────

function TaskCard({
  task, expanded, onToggle, onComplete, onDelete,
}: {
  task: InteractionTask
  expanded: boolean
  onToggle: () => void
  onComplete: () => void
  onDelete: () => void
}) {
  const goal = GOAL_CONFIG[task.goal]
  const priority = PRIORITY_CONFIG[task.priority]
  const dateStr = formatDate(task.scheduledAt)
  const isOverdue = new Date(task.scheduledAt) < new Date() && task.status === 'pending'

  return (
    <div className={`rounded-lg border transition-all ${isOverdue ? 'border-red-400/40 bg-red-400/5' : 'border-border bg-card'}`}>
      <div className="flex items-center gap-2 p-3 cursor-pointer select-none" onClick={onToggle}>
        <button
          onClick={e => { e.stopPropagation(); onComplete() }}
          className="shrink-0 w-5 h-5 rounded border-2 border-[hsl(var(--gold))] hover:bg-[hsl(var(--gold)/0.2)] transition-colors cursor-pointer"
          title="标记完成"
        />
        <span className="text-base shrink-0">{goal.icon}</span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground truncate">{task.title}</p>
          <p className="text-[10px] text-muted-foreground">{goal.label}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className={`text-[10px] px-1.5 py-0.5 rounded border ${priority.color}`}>
            {priority.label}
          </span>
          <span className={`text-[10px] ${isOverdue ? 'text-red-400 font-medium' : 'text-muted-foreground'}`}>
            {dateStr}
          </span>
          <span className="text-[10px] text-muted-foreground">{expanded ? '▲' : '▼'}</span>
          <button onClick={e => { e.stopPropagation(); onDelete() }}
            className="text-muted-foreground hover:text-red-400 text-xs transition-colors cursor-pointer ml-1">✕</button>
        </div>
      </div>

      {expanded && (
        <div className="px-3 pb-3 space-y-2 border-t border-border pt-2">
          {task.description && (
            <p className="text-xs text-muted-foreground leading-relaxed">{task.description}</p>
          )}
          {task.strategy && (
            <div className="p-2.5 rounded bg-muted/50 border border-border">
              <p className="text-[10px] text-[hsl(var(--gold))] font-semibold mb-1.5 uppercase tracking-wider">💡 策略要点</p>
              <p className="text-xs text-foreground whitespace-pre-wrap leading-relaxed">{task.strategy}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ─── LeaderCard ───────────────────────────────────────────────────────────────

function LeaderCard({
  leader,
  taskCount,
  tasks,
  onClick,
  onDelete,
}: {
  leader: LeaderNode
  taskCount: number
  tasks: InteractionTask[]
  onClick: () => void
  onDelete: () => void
}) {
  const archetype = leader.archetypeId ? ARCHETYPES.find(a => a.id === leader.archetypeId) : null
  const rel = REL_LEVEL_CONFIG[leader.relationshipLevel]

  // 计算该领导的健康度
  const healthScore = calculateHealthScore(leader, tasks)
  const getHealthColor = (score: number) => {
    if (score >= 80) return 'text-emerald-400'
    if (score >= 60) return 'text-[hsl(var(--cyber))]'
    if (score >= 40) return 'text-amber-400'
    return 'text-red-400'
  }

  return (
    <div
      onClick={onClick}
      className="card-dramatic p-4 cursor-pointer hover:border-[hsl(var(--gold)/0.5)] transition-all group relative rounded-xl"
    >
      <button
        onClick={e => { e.stopPropagation(); onDelete() }}
        className="absolute top-3 right-3 text-muted-foreground hover:text-red-400 transition-colors text-sm opacity-0 group-hover:opacity-100 cursor-pointer z-10"
      >✕</button>

      <div className="flex items-start gap-3">
        <div className="relative">
          <div className="w-12 h-12 rounded-full bg-muted border-2 border-border flex items-center justify-center text-xl shrink-0 group-hover:border-[hsl(var(--gold))] transition-colors">
            {archetype?.emoji ?? '👤'}
          </div>
          {/* 健康度小圆点 */}
          <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-background border-2 ${getHealthColor(healthScore).replace('text-', 'border-')} flex items-center justify-center`}>
            <span className={`text-[10px] font-bold ${getHealthColor(healthScore)}`}>{healthScore}</span>
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5 flex-wrap">
            <span className="font-bold text-foreground">{leader.name}</span>
            <span className={`flex items-center gap-1 text-[10px] font-medium ${rel.color}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${rel.dot}`} />
              {rel.label}
            </span>
          </div>
          <p className="text-xs text-muted-foreground truncate">
            {[leader.title, leader.department].filter(Boolean).join(' · ')}
          </p>
          {archetype && (
            <p className="text-[10px] text-[hsl(var(--cyber))] mt-0.5">{archetype.nameZh}</p>
          )}
        </div>
      </div>

      {leader.personalityNotes && (
        <p className="text-xs text-muted-foreground mt-2.5 line-clamp-2 leading-relaxed border-t border-border pt-2">
          {leader.personalityNotes}
        </p>
      )}

      <div className="flex items-center justify-between mt-3 pt-2 border-t border-border">
        <span className={`text-[10px] ${taskCount > 0 ? 'text-[hsl(var(--gold))]' : 'text-muted-foreground'}`}>
          {taskCount > 0 ? `📋 ${taskCount} 项待办` : '暂无待办任务'}
        </span>
        <span className="text-[10px] text-[hsl(var(--gold))] opacity-0 group-hover:opacity-100 transition-opacity">
          查看详情 →
        </span>
      </div>
    </div>
  )
}

// ─── LeaderDetail Panel ───────────────────────────────────────────────────────

function LeaderDetailPanel({
  leader,
  tasks,
  onUpdateLeader,
  onAddTask,
  onCompleteTask,
  onDeleteTask,
  onClose,
}: {
  leader: LeaderNode
  tasks: InteractionTask[]
  onUpdateLeader: (data: Partial<LeaderNode>) => void
  onAddTask: (data: Omit<InteractionTask, 'id' | 'createdAt'>) => void
  onCompleteTask: (id: string) => void
  onDeleteTask: (id: string) => void
  onClose: () => void
}) {
  const [editing, setEditing] = useState(false)
  const [addingTask, setAddingTask] = useState(false)
  const [expandedTask, setExpandedTask] = useState<string | null>(null)
  const [showDone, setShowDone] = useState(false)

  const archetype = leader.archetypeId ? ARCHETYPES.find(a => a.id === leader.archetypeId) : null
  const rel = REL_LEVEL_CONFIG[leader.relationshipLevel]
  const pendingTasks = tasks
    .filter(t => t.status === 'pending')
    .sort((a, b) => {
      const prio = { high: 0, medium: 1, low: 2 }
      if (prio[a.priority] !== prio[b.priority]) return prio[a.priority] - prio[b.priority]
      return new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime()
    })
  const doneTasks = tasks.filter(t => t.status === 'done')

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto bg-card border border-border rounded-t-2xl sm:rounded-2xl animate-slide-up"
        onClick={e => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-card border-b border-border px-5 py-4 flex items-center gap-3 z-10">
          <div className="w-10 h-10 rounded-full bg-muted border border-border flex items-center justify-center text-lg shrink-0">
            {archetype?.emoji ?? '👤'}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-foreground">{leader.name}</span>
              <span className={`text-[10px] font-medium flex items-center gap-1 ${rel.color}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${rel.dot}`} />
                {rel.label}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              {[leader.title, leader.department].filter(Boolean).join(' · ')}
            </p>
          </div>
          <button onClick={() => setEditing(!editing)}
            className="text-xs px-3 py-1.5 rounded border border-border text-muted-foreground hover:border-[hsl(var(--gold))] hover:text-[hsl(var(--gold))] transition-colors cursor-pointer shrink-0">
            {editing ? '收起' : '✏️ 编辑'}
          </button>
          <button onClick={onClose}
            className="text-muted-foreground hover:text-foreground text-xl leading-none ml-1 cursor-pointer shrink-0">✕</button>
        </div>

        <div className="p-5 space-y-5">
          {editing ? (
            <div className="card-dramatic p-4 rounded-xl">
              <p className="text-xs font-semibold text-[hsl(var(--gold))] mb-3 uppercase tracking-wider">编辑领导档案</p>
              <LeaderForm
                initial={leader}
                onSubmit={data => { onUpdateLeader(data); setEditing(false) }}
                onCancel={() => setEditing(false)}
              />
            </div>
          ) : (
            <div className="space-y-3">
              {archetype && (
                <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 border border-border">
                  <img src={archetype.portraitImage} alt={archetype.nameZh}
                    className="w-12 h-12 rounded-lg object-cover border border-[hsl(var(--gold)/0.4)] shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-foreground">{archetype.nameZh}</p>
                    <p className="text-[10px] text-muted-foreground italic line-clamp-2 mt-0.5">{archetype.dramaticIntro}</p>
                  </div>
                </div>
              )}
              {leader.personalityNotes && <InfoBlock icon="🧠" label="性格特征" content={leader.personalityNotes} />}
              {leader.behaviorPatterns && <InfoBlock icon="⚙️" label="行为模式" content={leader.behaviorPatterns} color="text-[hsl(var(--cyber))]" />}
              {leader.preferences && <InfoBlock icon="✅" label="偏好喜好" content={leader.preferences} color="text-emerald-400" />}
              {leader.avoidances && <InfoBlock icon="⛔" label="规避禁忌" content={leader.avoidances} color="text-red-400" />}
              {archetype && (
                <div className="p-3 rounded-xl bg-muted/30 border border-border">
                  <p className="text-[10px] font-semibold text-[hsl(var(--gold))] uppercase tracking-wider mb-2">🎯 AI推荐互动策略</p>
                  <div className="space-y-1.5">
                    {archetype.strategies.map((s, i) => (
                      <p key={i} className="text-xs text-foreground flex items-start gap-1.5">
                        <span className="text-[hsl(var(--gold))] shrink-0">›</span>{s}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-bold text-foreground flex items-center gap-2">
                互动任务看板
                {pendingTasks.length > 0 && (
                  <span className="text-xs bg-[hsl(var(--gold)/0.2)] text-[hsl(var(--gold))] px-2 py-0.5 rounded-full font-semibold">
                    {pendingTasks.length}
                  </span>
                )}
              </p>
              <button onClick={() => setAddingTask(!addingTask)}
                className="text-xs btn-cyber px-3 py-1.5 rounded-lg font-medium cursor-pointer">
                {addingTask ? '取消' : '+ 新增任务'}
              </button>
            </div>

            {addingTask && (
              <div className="card-dramatic p-4 mb-3 rounded-xl">
                <TaskForm
                  leaderId={leader.id}
                  onSubmit={data => { onAddTask(data); setAddingTask(false) }}
                  onCancel={() => setAddingTask(false)}
                />
              </div>
            )}

            {pendingTasks.length === 0 && !addingTask && (
              <div className="text-center py-8 text-sm text-muted-foreground border border-dashed border-border rounded-xl">
                暂无待办任务<br />
                <span className="text-[10px]">点击「新增任务」规划你的下一步行动</span>
              </div>
            )}

            <div className="space-y-2">
              {pendingTasks.map(task => (
                <TaskCard
                  key={task.id}
                  task={task}
                  expanded={expandedTask === task.id}
                  onToggle={() => setExpandedTask(expandedTask === task.id ? null : task.id)}
                  onComplete={() => onCompleteTask(task.id)}
                  onDelete={() => onDeleteTask(task.id)}
                />
              ))}
            </div>

            {doneTasks.length > 0 && (
              <div className="mt-3">
                <button onClick={() => setShowDone(!showDone)}
                  className="text-[10px] text-muted-foreground hover:text-foreground cursor-pointer transition-colors">
                  {showDone ? '▲ 收起' : '▼ 查看'}已完成 ({doneTasks.length})
                </button>
                {showDone && (
                  <div className="space-y-1 mt-2">
                    {doneTasks.map(t => (
                      <div key={t.id} className="flex items-center gap-2 p-2 rounded-lg opacity-50">
                        <span className="text-[hsl(var(--gold))] text-xs">✓</span>
                        <span className="flex-1 text-xs line-through text-muted-foreground">{t.title}</span>
                        <button onClick={() => onDeleteTask(t.id)}
                          className="text-xs text-muted-foreground hover:text-red-400 cursor-pointer">✕</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Dashboard (全局看板) ──────────────────────────────────────────────────────

// 计算单个领导的关系健康度
function calculateHealthScore(leader: LeaderNode, leaderTasks: InteractionTask[]): number {
  // 关系状态分 (0-100)
  const relLevelScores: Record<RelationshipLevel, number> = {
    close: 100,    // 亲密盟友
    normal: 70,    // 正常同事
    cautious: 40,  // 谨慎相处
    tense: 10,     // 关系紧张
  }
  const relScore = relLevelScores[leader.relationshipLevel]

  // 任务完成率分 (0-100)
  const doneTasks = leaderTasks.filter(t => t.status === 'done')
  const totalTasks = leaderTasks.length
  const completionRate = totalTasks > 0 ? (doneTasks.length / totalTasks) * 100 : 50 // 无任务时给50分基准

  // 逾期惩罚 (-30 到 0)
  const pendingTasks = leaderTasks.filter(t => t.status === 'pending')
  const overdueTasks = pendingTasks.filter(t => new Date(t.scheduledAt) < new Date())
  const overduePenalty = totalTasks > 0 ? -(overdueTasks.length / totalTasks) * 30 : 0

  // 互动效果分 (0-100, 如果有outcome记录)
  const tasksWithOutcome = doneTasks.filter(t => t.outcome)
  const outcomeScores: Record<string, number> = { excellent: 100, good: 80, average: 50, poor: 20 }
  const avgOutcomeScore = tasksWithOutcome.length > 0
    ? tasksWithOutcome.reduce((sum, t) => sum + (outcomeScores[t.outcome!] || 50), 0) / tasksWithOutcome.length
    : 50 // 无记录时给50分基准

  // 加权计算: 关系40% + 完成率30% + 效果20% + 基础分10%
  const totalScore = Math.round(
    relScore * 0.4 +
    completionRate * 0.3 +
    avgOutcomeScore * 0.2 +
    10 + // 基础分
    overduePenalty
  )

  return Math.max(0, Math.min(100, totalScore))
}

function RelStats({ leaders, tasks }: { leaders: LeaderNode[]; tasks: InteractionTask[] }) {
  const pending = tasks.filter(t => t.status === 'pending').length
  const done = tasks.filter(t => t.status === 'done').length
  const overdue = tasks.filter(t => t.status === 'pending' && new Date(t.scheduledAt) < new Date()).length

  const relDist = leaders.reduce((acc, l) => {
    acc[l.relationshipLevel] = (acc[l.relationshipLevel] ?? 0) + 1
    return acc
  }, {} as Record<string, number>)

  // 计算平均健康度
  const avgHealthScore = leaders.length > 0
    ? Math.round(leaders.reduce((sum, l) => {
        const leaderTasks = tasks.filter(t => t.leaderId === l.id)
        return sum + calculateHealthScore(l, leaderTasks)
      }, 0) / leaders.length)
    : 0

  // 健康度等级
  const getHealthLevel = (score: number) => {
    if (score >= 80) return { label: '健康', color: 'text-emerald-400', bg: 'bg-emerald-400/10', emoji: '💚' }
    if (score >= 60) return { label: '良好', color: 'text-[hsl(var(--cyber))]', bg: 'bg-[hsl(var(--cyber))/0.1]', emoji: '💙' }
    if (score >= 40) return { label: '一般', color: 'text-amber-400', bg: 'bg-amber-400/10', emoji: '💛' }
    return { label: '预警', color: 'text-red-400', bg: 'bg-red-400/10', emoji: '❤️' }
  }

  const healthLevel = getHealthLevel(avgHealthScore)

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {/* 健康度总览 */}
        <div className={`card-dramatic p-3 text-center rounded-xl ${healthLevel.bg} border-2 border-current/20`}>
          <div className="flex items-center justify-center gap-1 mb-1">
            <span className="text-lg">{healthLevel.emoji}</span>
            <span className={`text-2xl font-black ${healthLevel.color}`}>{avgHealthScore}</span>
          </div>
          <p className="text-[10px] text-muted-foreground">{healthLevel.label}指数</p>
        </div>

        {[
          { label: '关系网络', value: leaders.length, unit: '位', color: 'text-[hsl(var(--cyber))]' },
          { label: '待办任务', value: pending, unit: '项', color: 'text-[hsl(var(--gold))]' },
          { label: '已逾期', value: overdue, unit: '项', color: overdue > 0 ? 'text-red-400' : 'text-muted-foreground' },
          { label: '已完成', value: done, unit: '项', color: 'text-emerald-400' },
        ].map(s => (
          <div key={s.label} className="card-dramatic p-3 text-center rounded-xl">
            <p className={`text-2xl font-black ${s.color}`}>
              {s.value}<span className="text-sm font-normal ml-0.5">{s.unit}</span>
            </p>
            <p className="text-[10px] text-muted-foreground mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {leaders.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {(Object.entries(REL_LEVEL_CONFIG) as [RelationshipLevel, typeof REL_LEVEL_CONFIG[RelationshipLevel]][]).map(([k, v]) =>
            relDist[k] ? (
              <span key={k} className={`text-[10px] flex items-center gap-1 ${v.color}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${v.dot}`} />
                {v.label} {relDist[k]}
              </span>
            ) : null
          )}
        </div>
      )}
    </div>
  )
}

function DashTaskRow({ task, leaderName, leaderArchetypeId, onLeaderClick, onComplete, onGenerateDraft }: {
  task: InteractionTask
  leaderName: string
  leaderArchetypeId: number | null
  onLeaderClick: () => void
  onComplete: () => void
  onGenerateDraft?: () => void
}) {
  const goal = GOAL_CONFIG[task.goal]
  const priority = PRIORITY_CONFIG[task.priority]
  const isOverdue = new Date(task.scheduledAt) < new Date()
  const commScenario = GOAL_TO_COMM_SCENARIO[task.goal]

  return (
    <div className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${isOverdue ? 'border-red-400/30 bg-red-400/5' : 'border-border bg-card hover:border-[hsl(var(--gold)/0.3)]'}`}>
      <button onClick={onComplete}
        className="shrink-0 w-5 h-5 rounded border-2 border-[hsl(var(--gold))] hover:bg-[hsl(var(--gold)/0.2)] transition-colors cursor-pointer" />
      <span className="text-base shrink-0">{goal.icon}</span>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-foreground truncate font-medium">{task.title}</p>
        <div className="flex items-center gap-1.5 mt-0.5">
          <button onClick={onLeaderClick}
            className="text-[10px] text-[hsl(var(--cyber))] hover:text-[hsl(var(--gold))] transition-colors cursor-pointer underline-offset-2 hover:underline">
            {leaderName}
          </button>
          <span className="text-[10px] text-muted-foreground">·</span>
          <span className="text-[10px] text-muted-foreground">{goal.label}</span>
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {leaderArchetypeId && commScenario && onGenerateDraft && (
          <button
            onClick={(e) => { e.stopPropagation(); onGenerateDraft() }}
            className="text-[10px] px-2 py-1 rounded border border-[hsl(var(--cyber))/40] text-[hsl(var(--cyber))] hover:bg-[hsl(var(--cyber)/0.1)] transition-colors cursor-pointer"
            title="根据领导类型自动生成话术"
          >
            📝 话术
          </button>
        )}
        <span className={`text-[10px] px-1.5 py-0.5 rounded border ${priority.color}`}>{priority.label}</span>
        <span className={`text-[10px] font-medium ${isOverdue ? 'text-red-400' : 'text-muted-foreground'}`}>
          {formatDate(task.scheduledAt)}
        </span>
      </div>
    </div>
  )
}

function DashboardView({
  leaders,
  tasks,
  onSelectLeader,
  onCompleteTask,
  onNavigateToDrafter,
  onLogTaskOutcome,
}: {
  leaders: LeaderNode[]
  tasks: InteractionTask[]
  onSelectLeader: (id: string) => void
  onCompleteTask: (id: string) => void
  onNavigateToDrafter?: (archetypeId: number, leaderName: string, scenarioId?: string) => void
  onLogTaskOutcome?: (id: string, data: { outcome: InteractionOutcome; actualResult: string; lessonsLearned: string }) => void
}) {
  const leaderMap = new Map(leaders.map(l => [l.id, l]))
  const pending = tasks
    .filter(t => t.status === 'pending')
    .sort((a, b) => {
      const prio = { high: 0, medium: 1, low: 2 }
      if (prio[a.priority] !== prio[b.priority]) return prio[a.priority] - prio[b.priority]
      return new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime()
    })

  const overdue = pending.filter(t => new Date(t.scheduledAt) < new Date())
  const upcoming = pending.filter(t => new Date(t.scheduledAt) >= new Date())

  // 任务日志弹窗状态
  const [loggingTaskId, setLoggingTaskId] = useState<string | null>(null)
  const loggingTask = loggingTaskId ? tasks.find(t => t.id === loggingTaskId) : null

  const handleCompleteTask = (id: string) => {
    if (onLogTaskOutcome) {
      // 弹出日志记录弹窗
      setLoggingTaskId(id)
    } else {
      // 直接完成
      onCompleteTask(id)
    }
  }

  const handleLogSubmit = (data: { outcome: InteractionOutcome; actualResult: string; lessonsLearned: string }) => {
    if (loggingTaskId) {
      onLogTaskOutcome?.(loggingTaskId, data)
      onCompleteTask(loggingTaskId)
      setLoggingTaskId(null)
    }
  }

  if (leaders.length === 0) {
    return (
      <div className="space-y-4">
        <EmptyState icon="🗺️" title="关系网络尚未建立"
          desc='前往「我的领导」标签，建立你的第一个领导档案' />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <RelStats leaders={leaders} tasks={tasks} />

      {pending.length === 0 && (
        <EmptyState icon="✅" title="暂无待办任务"
          desc='点击领导卡片进入详情页，为每位领导规划互动任务' />
      )}

      {overdue.length > 0 && (
        <div>
          <p className="text-sm font-bold text-red-400 mb-3 flex items-center gap-2">
            ⚠️ 已逾期
            <span className="text-xs bg-red-400/20 text-red-400 px-1.5 py-0.5 rounded-full">{overdue.length}</span>
          </p>
          <div className="space-y-2">
            {overdue.map(t => {
              const l = leaderMap.get(t.leaderId)
              return (
                <DashTaskRow key={t.id} task={t} leaderName={l?.name ?? '?'}
                  leaderArchetypeId={l?.archetypeId ?? null}
                  onLeaderClick={() => l && onSelectLeader(l.id)}
                  onComplete={() => handleCompleteTask(t.id)}
                  onGenerateDraft={l?.archetypeId ? () => onNavigateToDrafter?.(l.archetypeId!, l.name, GOAL_TO_COMM_SCENARIO[t.goal] ?? undefined) : undefined}
                />
              )
            })}
          </div>
        </div>
      )}

      {upcoming.length > 0 && (
        <div>
          <p className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
            📋 待执行
            <span className="text-xs bg-[hsl(var(--gold)/0.2)] text-[hsl(var(--gold))] px-1.5 py-0.5 rounded-full">{upcoming.length}</span>
          </p>
          <div className="space-y-2">
            {upcoming.map(t => {
              const l = leaderMap.get(t.leaderId)
              return (
                <DashTaskRow key={t.id} task={t} leaderName={l?.name ?? '?'}
                  leaderArchetypeId={l?.archetypeId ?? null}
                  onLeaderClick={() => l && onSelectLeader(l.id)}
                  onComplete={() => handleCompleteTask(t.id)}
                  onGenerateDraft={l?.archetypeId ? () => onNavigateToDrafter?.(l.archetypeId!, l.name, GOAL_TO_COMM_SCENARIO[t.goal] ?? undefined) : undefined}
                />
              )
            })}
          </div>
        </div>
      )}

      {/* 任务日志弹窗 */}
      {loggingTask && (
        <TaskOutcomeModal
          taskTitle={loggingTask.title}
          onSubmit={handleLogSubmit}
          onClose={() => setLoggingTaskId(null)}
        />
      )}
    </div>
  )
}

// ─── Main Component ────────────────────────────────────────────────────────────

type NetworkTab = 'dashboard' | 'leaders'

// ─── Onboarding Guide ─────────────────────────────────────────────────────────

const ONBOARDING_STEPS = [
  {
    icon: '🎭',
    title: '认识你的领导类型',
    desc: '先了解不同领导的行为模式和沟通偏好',
    action: '前往领导画像',
    target: 'profiler',
  },
  {
    icon: '📂',
    title: '建立领导关系档案',
    desc: '为你遇到的领导建立档案，记录互动策略',
    action: '立即建档',
    target: 'leaders',
  },
  {
    icon: '⚔️',
    title: '遇到职场困境时',
    desc: '来这里分析场景，获取针对性策略',
    action: '试试场景分析',
    target: 'scenario',
  },
]

function OnboardingGuide({ onDismiss, onStartGuide }: { onDismiss: () => void; onStartGuide: (target: string) => void }) {
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center" onClick={onDismiss}>
      <div className="absolute inset-0 bg-black/80" />
      <div className="relative w-full max-w-md mx-4 bg-card border border-[hsl(var(--gold))] rounded-2xl p-6 animate-slide-up shadow-2xl">
        <div className="text-center mb-6">
          <span className="text-4xl mb-3 block">🎯</span>
          <h2 className="text-xl font-bold text-foreground mb-2">欢迎使用管领导系统</h2>
          <p className="text-sm text-muted-foreground">三步开始你的向上管理之旅</p>
        </div>

        <div className="space-y-3 mb-6">
          {ONBOARDING_STEPS.map((step, i) => (
            <button
              key={i}
              onClick={(e) => { e.stopPropagation(); onStartGuide(step.target) }}
              className="w-full p-4 rounded-xl border border-border hover:border-[hsl(var(--gold))] hover:bg-[hsl(var(--gold)/0.05)] transition-all text-left group"
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">{step.icon}</span>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground group-hover:text-[hsl(var(--gold))] transition-colors">{step.title}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">{step.desc}</p>
                </div>
                <span className="text-xs text-[hsl(var(--gold))] group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </button>
          ))}
        </div>

        <div className="flex gap-3">
          <button onClick={onDismiss} className="flex-1 py-2.5 rounded-lg text-sm border border-border text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
            稍后再说
          </button>
          <button onClick={onDismiss} className="flex-1 btn-gold py-2.5 rounded-lg text-sm font-bold cursor-pointer">
            开始使用
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Main Component ────────────────────────────────────────────────────────────

export default function RelationshipNetwork({ onNavigateToDrafter, preselectedArchetypeId }: { onNavigateToDrafter?: (archetypeId: number, leaderName: string, scenarioId?: string) => void; preselectedArchetypeId?: number }) {
  const { leaders, tasks, addLeader, updateLeader, deleteLeader, addTask, completeTask, deleteTask, logTaskOutcome } = useLeaderNetwork()
  const [tab, setTab] = useState<NetworkTab>('dashboard')
  const [addingLeader, setAddingLeader] = useState(false)
  const [selectedLeaderId, setSelectedLeaderId] = useState<string | null>(null)

  // 新用户引导状态
  const [showOnboarding, setShowOnboarding] = useState(() => {
    if (typeof window !== 'undefined') {
      const hasCompletedOnboarding = localStorage.getItem('has-completed-onboarding')
      const hasLeaders = leaders.length > 0
      return !hasCompletedOnboarding && !hasLeaders && !preselectedArchetypeId
    }
    return false
  })

  const handleDismissOnboarding = () => {
    localStorage.setItem('has-completed-onboarding', 'true')
    setShowOnboarding(false)
  }

  const handleStartGuide = (target: string) => {
    localStorage.setItem('has-completed-onboarding', 'true')
    setShowOnboarding(false)
    // 触发全局导航（通过window事件）
    window.dispatchEvent(new CustomEvent('navigate-to-tab', { detail: target }))
  }

  // 如果有预选的原型ID，自动打开新建表单并预填
  useEffect(() => {
    if (preselectedArchetypeId) {
      setAddingLeader(true)
      setTab('leaders')
    }
  }, [preselectedArchetypeId])

  const selectedLeader = selectedLeaderId ? leaders.find(l => l.id === selectedLeaderId) ?? null : null
  const selectedTasks = useMemo(
    () => selectedLeaderId ? tasks.filter(t => t.leaderId === selectedLeaderId) : [],
    [tasks, selectedLeaderId]
  )
  const taskCountByLeader = useMemo(() => {
    const map = new Map<string, number>()
    tasks.filter(t => t.status === 'pending').forEach(t => {
      map.set(t.leaderId, (map.get(t.leaderId) ?? 0) + 1)
    })
    return map
  }, [tasks])

  const handleSelectLeader = (id: string) => {
    setSelectedLeaderId(id)
    setTab('leaders')
  }

  return (
    <div className="space-y-5">
      {/* 新用户引导 */}
      {showOnboarding && (
        <OnboardingGuide
          onDismiss={handleDismissOnboarding}
          onStartGuide={handleStartGuide}
        />
      )}

      {/* Sub-tabs */}
      <div className="flex gap-1 border-b border-border">
        {([
          { id: 'dashboard', label: '📊 任务看板', desc: `${tasks.filter(t => t.status === 'pending').length} 项待办` },
          { id: 'leaders',   label: '👥 我的领导', desc: `${leaders.length} 位` },
        ] as { id: NetworkTab; label: string; desc: string }[]).map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`px-4 py-2.5 text-sm font-medium rounded-t-lg transition-all cursor-pointer whitespace-nowrap ${
              tab === t.id
                ? 'text-foreground bg-card border border-border border-b-transparent'
                : 'text-muted-foreground hover:text-foreground hover:bg-card/50'
            }`}>
            {t.label}
            <span className="ml-1.5 text-[10px] text-muted-foreground hidden sm:inline">{t.desc}</span>
          </button>
        ))}
      </div>

      {/* Dashboard Tab */}
      {tab === 'dashboard' && (
        <DashboardView
          leaders={leaders}
          tasks={tasks}
          onSelectLeader={handleSelectLeader}
          onCompleteTask={completeTask}
          onNavigateToDrafter={onNavigateToDrafter}
          onLogTaskOutcome={logTaskOutcome}
        />
      )}

      {/* Leaders Tab */}
      {tab === 'leaders' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              已建档&nbsp;<span className="text-foreground font-semibold">{leaders.length}</span>&nbsp;位领导
            </p>
            <button onClick={() => setAddingLeader(!addingLeader)}
              className="btn-gold px-4 py-2 rounded-lg text-sm font-bold cursor-pointer">
              {addingLeader ? '取消' : '+ 建立新档案'}
            </button>
          </div>

          {addingLeader && (
            <div className="card-dramatic p-5 rounded-xl">
              <p className="text-xs font-semibold text-[hsl(var(--gold))] mb-3 uppercase tracking-wider">
                {preselectedArchetypeId ? '🎭 根据原型快速建档' : '🎭 新建领导档案'}
              </p>
              <LeaderForm
                initial={preselectedArchetypeId ? { archetypeId: preselectedArchetypeId } : undefined}
                onSubmit={data => { addLeader(data); setAddingLeader(false) }}
                onCancel={() => setAddingLeader(false)}
              />
            </div>
          )}

          {leaders.length === 0 && !addingLeader && (
            <EmptyState icon="🎭" title="暂无领导档案"
              desc='点击「建立新档案」，可选择预设模板快速创建或手动填写' />
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {leaders.map(leader => (
              <LeaderCard
                key={leader.id}
                leader={leader}
                taskCount={taskCountByLeader.get(leader.id) ?? 0}
                tasks={tasks.filter(t => t.leaderId === leader.id)}
                onClick={() => setSelectedLeaderId(leader.id)}
                onDelete={() => {
                  if (confirm(`确定删除「${leader.name}」的档案及全部关联任务？`)) {
                    deleteLeader(leader.id)
                  }
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Leader Detail Modal */}
      {selectedLeader && (
        <LeaderDetailPanel
          leader={selectedLeader}
          tasks={selectedTasks}
          onUpdateLeader={data => updateLeader(selectedLeader.id, data)}
          onAddTask={addTask}
          onCompleteTask={completeTask}
          onDeleteTask={deleteTask}
          onClose={() => setSelectedLeaderId(null)}
        />
      )}
    </div>
  )
}
