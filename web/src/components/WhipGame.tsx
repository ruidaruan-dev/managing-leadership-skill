import { useState, useCallback } from 'react'
import { ARCHETYPES } from '@/data/archetypes'
import { PET_DIALOGUES } from '@/data/petDialogues'

type AnimPhase = 'idle' | 'powerup' | 'swinging' | 'impact' | 'stars' | 'bubble'

export default function WhipGame({
  leaderId,
  petNickname,
  totalWhips,
  onWhip,
}: {
  leaderId: number
  petNickname: string
  totalWhips: number
  onWhip: (quote: string) => void
}) {
  const [quote, setQuote] = useState('')
  const [phase, setPhase] = useState<AnimPhase>('idle')
  const [defeatLine, setDefeatLine] = useState('')

  const archetype = ARCHETYPES.find(a => a.id === leaderId)!
  const dialogue = PET_DIALOGUES[leaderId]

  const triggerWhip = useCallback(() => {
    if (!quote.trim() || phase !== 'idle') return

    const lines = dialogue.defeatLines
    const line = lines[Math.floor(Math.random() * lines.length)]
    setDefeatLine(line)
    onWhip(quote.trim())

    // Animation chain
    setPhase('powerup')
    setTimeout(() => setPhase('swinging'), 200)
    setTimeout(() => setPhase('impact'), 500)
    setTimeout(() => setPhase('stars'), 800)
    setTimeout(() => setPhase('bubble'), 1200)
    setTimeout(() => {
      setPhase('idle')
      setQuote('')
    }, 3500)
  }, [quote, phase, dialogue, onWhip])

  const petReaction = dialogue.painReaction

  return (
    <div className="card-dramatic p-5 sm:p-6">
      {/* Stats bar */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-[hsl(var(--gold))]">{archetype.emoji} {petNickname}</span>
          <span className="text-xs text-muted-foreground">({archetype.nameZh})</span>
        </div>
        <div className="flex items-center gap-1 text-xs">
          <span className="text-muted-foreground">总鞭数</span>
          <span className="font-mono font-bold text-[hsl(var(--gold))]">{totalWhips}</span>
        </div>
      </div>

      {/* Arena Stage */}
      <div className="relative bg-[hsl(225,25%,8%)] rounded-xl border border-border overflow-hidden mb-4" style={{ minHeight: 320 }}>
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[hsl(var(--gold)/0.03)] via-transparent to-[hsl(var(--gold)/0.05)]" />

        {/* "Me" character */}
        <div className={`absolute left-1/2 -translate-x-1/2 top-4 sm:top-6 transition-all duration-200 ${
          phase === 'powerup' ? 'scale-110 drop-shadow-[0_0_20px_hsl(var(--gold)/0.8)]' :
          phase === 'swinging' ? 'scale-105' : ''
        }`}>
          <img
            src="/images/me-character.png"
            alt="Me"
            className="w-24 h-24 sm:w-28 sm:h-28 object-contain"
            style={{ imageRendering: 'auto' }}
          />
          {phase === 'powerup' && (
            <div className="absolute inset-0 rounded-full bg-[hsl(var(--gold)/0.2)] animate-ping" />
          )}
        </div>

        {/* Whip visual */}
        {(phase === 'swinging' || phase === 'impact') && (
          <div className="absolute left-1/2 -translate-x-1/2 top-[120px] sm:top-[140px] w-1 h-16 origin-top animate-[whip-swing_300ms_ease-in_forwards]">
            <div className="w-full h-full bg-gradient-to-b from-[hsl(var(--gold))] to-[hsl(var(--gold)/0.3)] rounded-full shadow-[0_0_8px_hsl(var(--gold)/0.6)]" />
          </div>
        )}

        {/* Pet character */}
        <div className={`absolute left-1/2 -translate-x-1/2 bottom-16 sm:bottom-20 transition-all duration-300 ${
          phase === 'impact' ? (
            petReaction === 'bounce' ? 'animate-[pet-bounce_400ms_ease-out]' :
            petReaction === 'shake' ? 'animate-[pet-shake_400ms_ease-out]' :
            petReaction === 'spin' ? 'animate-[pet-spin_500ms_ease-out]' :
            'animate-[pet-shrink_400ms_ease-out]'
          ) : phase === 'stars' ? (
            petReaction === 'bounce' ? 'animate-[pet-bounce_400ms_ease-out]' :
            petReaction === 'shake' ? 'animate-[pet-shake_400ms_ease-out]' :
            petReaction === 'spin' ? 'animate-[pet-spin_500ms_ease-out]' :
            'animate-[pet-shrink_400ms_ease-out]'
          ) : ''
        }`}>
          <div className="relative">
            <img
              src={archetype.portraitImage}
              alt={archetype.nameZh}
              className="w-16 h-16 sm:w-20 sm:h-20 object-contain rounded-lg border border-[hsl(var(--cyber)/0.5)]"
              style={{ imageRendering: 'auto' }}
            />
            {/* Pet collar */}
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-1.5 rounded-full bg-[hsl(var(--gold))] shadow-[0_0_4px_hsl(var(--gold)/0.5)]" />
          </div>
        </div>

        {/* Impact stars */}
        {(phase === 'stars' || phase === 'bubble') && (
          <div className="absolute left-1/2 -translate-x-1/2 bottom-24 sm:bottom-28">
            {['✦', '⭐', '✦', '💥', '✦'].map((star, i) => (
              <span
                key={i}
                className="absolute text-sm animate-[pain-star_500ms_ease-out_forwards]"
                style={{
                  left: `${(i - 2) * 20}px`,
                  top: `${Math.sin(i) * 15}px`,
                  animationDelay: `${i * 80}ms`,
                  opacity: 0,
                }}
              >
                {star}
              </span>
            ))}
          </div>
        )}

        {/* Speech bubble */}
        {phase === 'bubble' && (
          <div className="absolute left-1/2 -translate-x-1/2 bottom-4 sm:bottom-6 max-w-[240px] animate-[bubble-pop_300ms_cubic-bezier(0.34,1.56,0.64,1)_forwards]">
            <div className="bg-card border border-border rounded-lg px-3 py-2 text-xs text-foreground shadow-lg relative">
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-b-[8px] border-transparent border-b-card" />
              {defeatLine}
            </div>
          </div>
        )}

        {/* Idle state hint */}
        {phase === 'idle' && totalWhips === 0 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs text-muted-foreground animate-pulse">
            输入领导说的话，然后狠狠鞭他！
          </div>
        )}
      </div>

      {/* Quote input + whip button */}
      <div className="flex gap-2">
        <input
          type="text"
          value={quote}
          onChange={e => setQuote(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && triggerWhip()}
          placeholder={`"${dialogue.catchphrase}" — 输入他今天说的话`}
          disabled={phase !== 'idle'}
          className="flex-1 bg-muted border border-border rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[hsl(var(--gold))] disabled:opacity-50"
        />
        <button
          onClick={triggerWhip}
          disabled={!quote.trim() || phase !== 'idle'}
          className="btn-gold px-5 py-2.5 text-sm font-bold rounded-lg disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
        >
          🔥 鞭！
        </button>
      </div>
    </div>
  )
}
