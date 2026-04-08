import { useState } from 'react'
import { TACTICAL_TIPS } from '@/data/tacticalTips'
import { useReminders } from '@/hooks/useReminders'

const FREQ_LABELS: Record<string, string> = {
  once: '仅一次',
  weekly: '每周',
  biweekly: '每两周',
  monthly: '每月',
}

const CAT_LABELS: Record<string, { label: string; color: string }> = {
  flattery: { label: '拍马', color: 'text-[hsl(var(--gold))]' },
  visibility: { label: '刷脸', color: 'text-[hsl(var(--cyber))]' },
  protection: { label: '保命', color: 'text-red-400' },
  intelligence: { label: '情报', color: 'text-purple-400' },
}

export default function TacticalReminders({ leaderId }: { leaderId: number }) {
  const { activeReminders, completedReminders, addReminder, completeReminder, deleteReminder } = useReminders()
  const [customText, setCustomText] = useState('')
  const [customFreq, setCustomFreq] = useState<'once' | 'weekly' | 'biweekly' | 'monthly'>('weekly')
  const [showCompleted, setShowCompleted] = useState(false)

  const tips = TACTICAL_TIPS[leaderId] || []
  const myReminders = activeReminders.filter(r => r.leaderId === leaderId)
  const myCompleted = completedReminders.filter(r => r.leaderId === leaderId)
  const addedTexts = new Set(myReminders.map(r => r.text).concat(myCompleted.map(r => r.text)))

  const handleAddSuggested = (tip: typeof tips[0]) => {
    addReminder({
      leaderId,
      text: tip.text,
      scheduledTime: new Date().toISOString(),
      repeatFrequency: tip.frequency,
      source: 'suggested',
    })
  }

  const handleAddCustom = () => {
    if (!customText.trim()) return
    addReminder({
      leaderId,
      text: customText.trim(),
      scheduledTime: new Date().toISOString(),
      repeatFrequency: customFreq,
      source: 'custom',
    })
    setCustomText('')
  }

  return (
    <div className="card-dramatic p-5 sm:p-6">
      <h3 className="text-base font-bold text-gradient-gold mb-1">拿捏策略</h3>
      <p className="text-xs text-muted-foreground mb-4">定期执行这些小动作，悄悄拿捏你的领导</p>

      {/* Suggested tactics */}
      <div className="space-y-2 mb-5">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">推荐策略</p>
        {tips.map((tip, i) => {
          const added = addedTexts.has(tip.text)
          const cat = CAT_LABELS[tip.category]
          return (
            <div key={i} className="flex items-start gap-2 p-2.5 rounded-lg bg-muted/50 border border-border">
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground leading-relaxed">{tip.text}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-[10px] font-semibold ${cat.color}`}>{cat.label}</span>
                  <span className="text-[10px] text-muted-foreground">{FREQ_LABELS[tip.frequency]}</span>
                </div>
              </div>
              <button
                onClick={() => handleAddSuggested(tip)}
                disabled={added}
                className="shrink-0 text-xs px-2.5 py-1 rounded border border-border hover:border-[hsl(var(--gold))] hover:text-[hsl(var(--gold))] transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              >
                {added ? '已添加' : '+ 提醒'}
              </button>
            </div>
          )
        })}
      </div>

      {/* Custom reminder */}
      <div className="mb-5">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">自定义提醒</p>
        <div className="flex gap-2">
          <input
            type="text"
            value={customText}
            onChange={e => setCustomText(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAddCustom()}
            placeholder="输入你自己的拿捏策略…"
            className="flex-1 bg-muted border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[hsl(var(--gold))]"
          />
          <select
            value={customFreq}
            onChange={e => setCustomFreq(e.target.value as typeof customFreq)}
            className="bg-muted border border-border rounded-lg px-2 py-2 text-xs text-foreground cursor-pointer"
          >
            <option value="weekly">每周</option>
            <option value="biweekly">每两周</option>
            <option value="monthly">每月</option>
            <option value="once">仅一次</option>
          </select>
          <button
            onClick={handleAddCustom}
            disabled={!customText.trim()}
            className="btn-cyber px-4 py-2 text-xs font-bold rounded-lg disabled:opacity-40 disabled:cursor-not-allowed"
          >
            添加
          </button>
        </div>
      </div>

      {/* Active reminders */}
      {myReminders.length > 0 && (
        <div className="mb-4">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            进行中的提醒 ({myReminders.length})
          </p>
          <div className="space-y-1.5">
            {myReminders.map(r => (
              <div key={r.id} className="flex items-center gap-2 p-2 rounded-lg bg-card border border-border">
                <button
                  onClick={() => completeReminder(r.id)}
                  className="shrink-0 w-5 h-5 rounded border-2 border-[hsl(var(--gold))] hover:bg-[hsl(var(--gold)/0.2)] transition-colors cursor-pointer"
                  title="标记完成"
                />
                <span className="flex-1 text-sm text-foreground">{r.text}</span>
                <span className="text-[10px] text-muted-foreground">{FREQ_LABELS[r.repeatFrequency]}</span>
                <button
                  onClick={() => deleteReminder(r.id)}
                  className="text-muted-foreground hover:text-red-400 text-xs cursor-pointer"
                >&times;</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Completed */}
      {myCompleted.length > 0 && (
        <div>
          <button
            onClick={() => setShowCompleted(!showCompleted)}
            className="text-xs text-muted-foreground hover:text-foreground cursor-pointer"
          >
            {showCompleted ? '隐藏' : '查看'}已完成 ({myCompleted.length})
          </button>
          {showCompleted && (
            <div className="space-y-1 mt-2">
              {myCompleted.map(r => (
                <div key={r.id} className="flex items-center gap-2 p-2 rounded-lg opacity-50">
                  <span className="text-[hsl(var(--gold))]">✓</span>
                  <span className="flex-1 text-sm line-through">{r.text}</span>
                  <button onClick={() => deleteReminder(r.id)} className="text-xs text-muted-foreground hover:text-red-400 cursor-pointer">&times;</button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <p className="text-[10px] text-muted-foreground mt-4 italic">* 提醒仅在浏览器打开时生效</p>
    </div>
  )
}
