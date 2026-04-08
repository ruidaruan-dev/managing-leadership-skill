import { useState } from 'react'
import LeaderProfiler from '@/components/LeaderProfiler'
import ScenarioAnalyzer from '@/components/ScenarioAnalyzer'
import CommunicationDrafter from '@/components/CommunicationDrafter'

type Tab = 'profiler' | 'scenario' | 'drafter'

const TABS: { id: Tab; label: string; icon: string; desc: string }[] = [
  { id: 'profiler', label: '领导画像', icon: '🎭', desc: '匹配16种领导原型' },
  { id: 'scenario', label: '场景分析', icon: '⚔️', desc: '10大职场困境策略' },
  { id: 'drafter', label: '沟通起草', icon: '✍️', desc: '定制化话术生成' },
]

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('profiler')

  return (
    <div className="min-h-screen">
      {/* Hero Header */}
      <header className="relative overflow-hidden border-b border-border">
        {/* Background image */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'url(/hero-bg.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/60 to-background" />

        <div className="relative container mx-auto px-4 pt-10 pb-8">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-mono uppercase tracking-widest text-cyber">Managing Leadership v1.0</span>
              <span className="w-1.5 h-1.5 rounded-full bg-cyber animate-glow-pulse" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-black mb-3 leading-tight">
              <span className="text-gradient-gold">管领导</span>
              <span className="text-foreground"> — AI时代反向管理指挥部</span>
            </h1>
            <p className="text-base text-muted-foreground leading-relaxed max-w-2xl">
              在AI不断夺走人类工作的时代，聪明的程序员不是被AI替代的那个，而是用AI来管理自己领导的那个。
              <span className="text-secondary-foreground">16种领导原型 × 10种职场困境 × 无限话术组合</span>，
              让你的职场博弈从直觉升级为系统。
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="relative container mx-auto px-4">
          <nav className="flex gap-1" role="tablist">
            {TABS.map(tab => (
              <button
                key={tab.id}
                role="tab"
                aria-selected={activeTab === tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`group relative px-5 py-3 rounded-t-lg text-sm font-medium transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-card text-foreground border border-border border-b-transparent'
                    : 'text-muted-foreground hover:text-foreground hover:bg-card/50'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                <span>{tab.label}</span>
                <span className="hidden sm:inline text-xs text-muted-foreground ml-2">
                  {tab.desc}
                </span>
                {activeTab === tab.id && (
                  <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-primary rounded-full" />
                )}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {activeTab === 'profiler' && <LeaderProfiler />}
        {activeTab === 'scenario' && <ScenarioAnalyzer />}
        {activeTab === 'drafter' && <CommunicationDrafter />}
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-6">
        <div className="container mx-auto px-4 text-center">
          <p className="text-xs text-muted-foreground">
            管领导 — Managing Leadership Skill &nbsp;|&nbsp; 
            本工具仅供职场策略参考，不鼓励任何不道德行为 &nbsp;|&nbsp;
            <span className="text-gold-dim">用AI管理领导，用智慧掌控职场</span>
          </p>
        </div>
      </footer>
    </div>
  )
}